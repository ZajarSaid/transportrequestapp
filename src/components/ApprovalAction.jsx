import { useState } from 'react'
import './ApprovalAction.css'

function ApprovalAction({
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
  requireComment = false,
  busy = false,
}) {
  const [comment, setComment] = useState('')

  const handleApprove = () => {
    if (requireComment && !comment.trim()) return
    onApprove({ comment: comment.trim() })
  }

  const handleReject = () => {
    if (requireComment && !comment.trim()) return
    onReject({ comment: comment.trim() })
  }

  const commentRequired = requireComment && !comment.trim()

  return (
    <div className="approval-action">
      <textarea
        className="form-control"
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="approval-action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleApprove}
          disabled={busy || commentRequired}
        >
          {approveLabel}
        </button>
        <button
          className="btn btn-danger"
          onClick={handleReject}
          disabled={busy || commentRequired}
        >
          {rejectLabel}
        </button>
      </div>
      {commentRequired && (
        <p className="approval-hint">
          A comment is required before you can {approveLabel.toLowerCase()} or{' '}
          {rejectLabel.toLowerCase()}.
        </p>
      )}
    </div>
  )
}

export default ApprovalAction