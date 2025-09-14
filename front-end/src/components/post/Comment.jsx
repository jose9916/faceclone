import TimeAgo from "react-timeago";
import esStrings from "react-timeago/lib/language-strings/es";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

export function Comment({ comment }) {
  const createdAt = comment?.commentAt ? new Date(comment.commentAt) : null;
  const formatter = buildFormatter(esStrings);
  return (
    <div className="comment">
      <img src={comment.commentBy.picture} alt="" className="comment_img" />
      <div className="comment_col">
        <div className="comment_wrap">
          <div className="comment_name">
            {comment.commentBy.first_name} {comment.commentBy.last_name}
          </div>
          <div className="comment_text">{comment.comment}</div>
        </div>

        {comment.image && (
          <img src={comment.image} alt="" className="comment_image" />
        )}

        <div className="comment_actions">
          <span>Like</span>
          <span>Reply</span>
          <span>
            {createdAt && (
              <TimeAgo date={createdAt} live={true} formatter={formatter} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
