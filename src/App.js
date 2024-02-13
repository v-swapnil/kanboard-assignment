import { useCallback, useEffect, useMemo, useState } from "react";

import {
  RiAddFill,
  RiCheckboxCircleFill,
  RiCircleFill,
  RiCircleLine,
  RiCloseCircleFill,
  RiEqualizerFill,
  RiErrorWarningFill,
  RiIndeterminateCircleFill,
  RiMoreFill,
  RiProgress4Fill,
  RiSignalWifi1Fill,
  RiSignalWifi2Fill,
  RiSignalWifi3Fill,
} from "@remixicon/react";

import "./App.css";

const imageMappings = {
  Todo: RiCircleLine,
  Done: RiCheckboxCircleFill,
  "In progress": RiProgress4Fill,
  Cancelled: RiCloseCircleFill,
  Backlog: RiIndeterminateCircleFill,
  "No priority": RiMoreFill,
  Low: RiSignalWifi1Fill,
  Medium: RiSignalWifi2Fill,
  High: RiSignalWifi3Fill,
  Urgent: RiErrorWarningFill,
  "Feature Request": RiCircleFill,
};

function Avatar({ userName, userIsAvailable }) {
  return (
    <div className="user-img-with-status" title={userName}>
      <img
        src={"https://picsum.photos/200?" + userName}
        alt="user-img"
        className="user-img"
      />
      <span
        className={
          "user-status " + (userIsAvailable ? "available" : "not-available")
        }
      />
    </div>
  );
}

function IconRenderer({ size, name, isUser, userIsAvailable }) {
  if (isUser) {
    return <Avatar userIsAvailable={userIsAvailable} userName={name} />;
  }
  const Icon = imageMappings[name];
  if (Icon) {
    return <Icon size={size || 20} />;
  }
  return null;
}

function TicketCard({
  id,
  status,
  title,
  userName,
  priorityText,
  userIsAvailable,
  tag,
  showStatusIcon,
  showPriorityIcon,
}) {
  const StatusIcon = showStatusIcon ? imageMappings[status] : null;
  const PriorityIcon = showPriorityIcon ? imageMappings[priorityText] : null;
  return (
    <div className="Ticket-card-container">
      <div className="Title-id-with-avatar">
        <div className="Ticket-id">{id}</div>
        <Avatar userIsAvailable={userIsAvailable} userName={userName} />
      </div>
      <div className="Ticket-description-with-icon">
        {StatusIcon && <StatusIcon size={20} />}
        <div className="Ticket-description">{title}</div>
      </div>
      <div className="Ticket-priority-with-tags">
        {PriorityIcon && (
          <div className="Ticket-priority" title={priorityText + " Priority"}>
            <PriorityIcon size={12} />
          </div>
        )}
        {tag.map((item) => (
          <div key={item} className="Ticket-tag">
            <IconRenderer name={tag} isUser={false} size={12} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function sortItemsByFieldName(items, fieldName) {
  return items.sort((a, b) =>
    typeof a[fieldName] === "number"
      ? b[fieldName] - a[fieldName]
      : a[fieldName].localeCompare(b[fieldName])
  );
}

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  const [groupBy, setGroupBy] = useState("status");
  const [orderBy, setOrderBy] = useState("title");

  const [show, setShow] = useState(false);

  const getData = useCallback(async () => {
    const url = "https://api.quicksell.co/v1/internal/frontend-assignment";
    const res = await fetch(url);
    const resJson = await res.json();
    setTickets(resJson.tickets);
    setUsers(resJson.users);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    const config = localStorage.getItem("config");
    try {
      const parsed = JSON.parse(config);
      setGroupBy(parsed.groupBy || "status");
      setOrderBy(parsed.orderBy || "title");
    } catch {}
  }, []);

  const onChangeFilter = useCallback(
    (field, value) => {
      const config = { orderBy, groupBy };
      if (field === "groupBy") {
        setGroupBy(value);
        config.groupBy = value;
      } else if (field === "orderBy") {
        setOrderBy(value);
        config.orderBy = value;
      }
      localStorage.setItem("config", JSON.stringify(config));
    },
    [orderBy, groupBy]
  );

  const ticketsWithUser = useMemo(() => {
    const priorityMappings = ["No priority", "Low", "Medium", "High", "Urgent"];
    return tickets.map((item) => {
      const usr = users.find((elem) => elem.id === item.userId);
      return {
        ...item,
        priorityText: priorityMappings[item.priority],
        userName: usr.name,
        userIsAvailable: usr.available,
      };
    });
  }, [tickets, users]);

  const groups = useMemo(() => {
    const result = {};

    ticketsWithUser.forEach((item) => {
      if (result[item[groupBy]]) {
        result[item[groupBy]].push(item);
      } else {
        result[item[groupBy]] = [item];
      }
    });

    return Object.keys(result).map((item) => ({
      name: item,
      tickets: sortItemsByFieldName(result[item], orderBy),
      userIsAvailable:
        groupBy === "userName" ? result[item][0]?.userIsAvailable : false,
    }));
  }, [ticketsWithUser, groupBy, orderBy]);

  return (
    <div className="App">
      <div className="App-header-content">
        <div
          className="filter-display-wrapper"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <div className="filter-display-trigger">
            <RiEqualizerFill size={16} /> Display
          </div>
          {show && (
            <div className="filter-display-content-wrapper">
              <div className="filter-display-content">
                <div className="filter-display-item">
                  <label>Grouping</label>
                  <select
                    value={groupBy}
                    onChange={(e) => onChangeFilter("groupBy", e.target.value)}
                  >
                    <option value="status">Status</option>
                    <option value="userName">User Name</option>
                    <option value="priorityText">Priority</option>
                  </select>
                </div>
                <div className="filter-display-item">
                  <label>Ordering</label>
                  <select
                    value={orderBy}
                    onChange={(e) => onChangeFilter("orderBy", e.target.value)}
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="App-main-content">
        {groups.map((item) => (
          <div className="Cards-container" key={item.name}>
            <div className="Card-group-container">
              <div className="Card-group-title">
                <IconRenderer
                  isUser={groupBy === "userName"}
                  name={item.name}
                  userIsAvailable={item.userIsAvailable}
                />
                {item.name}
                <span className="ticket-count">{item.tickets.length}</span>
              </div>
              <div>
                <button className="card-group-action">
                  <RiAddFill />
                </button>
                <button className="card-group-action">
                  <RiMoreFill />
                </button>
              </div>
            </div>
            <div>
              {item.tickets.map((elem) => (
                <TicketCard
                  key={elem.id}
                  {...elem}
                  showStatusIcon={groupBy !== "status"}
                  showPriorityIcon={groupBy !== "priority"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
