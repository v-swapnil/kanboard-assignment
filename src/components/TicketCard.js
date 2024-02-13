import Avatar from "./Avatar";
import IconRenderer from "./IconRenderer";

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
  return (
    <div className="Ticket-card-container">
      <div className="Title-id-with-avatar">
        <div className="Ticket-id">{id}</div>
        <Avatar userIsAvailable={userIsAvailable} userName={userName} />
      </div>
      <div className="Ticket-description-with-icon">
        {showStatusIcon && <IconRenderer name={status} size={20} />}
        <div className="Ticket-description">{title}</div>
      </div>
      <div className="Ticket-priority-with-tags">
        {showPriorityIcon && (
          <div className="Ticket-priority" title={priorityText + " Priority"}>
            <IconRenderer name={priorityText} size={12} />
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

export default TicketCard;
