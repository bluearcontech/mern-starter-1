import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Alert from './Alert'

const Message = ({ messages }) => (
  <div>
    {messages.map(message => (
      <Alert key={message.messageId} message={message} />
    ))}
  </div>
)

Message.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = state => ({
  messages: state.messages,
})

export default connect(mapStateToProps)(Message)
