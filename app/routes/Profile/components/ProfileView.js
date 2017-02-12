import React, { Component, PropTypes } from 'react'
import FormGroup from 'App/components/FormGroup'

class ProfileView extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      confirmPassword: '',
    }

    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  validatePassword = (password) => {
    if (!password.length) {
      return 'Password is required.'
    }
    return true
  }

  validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== this.state.password) {
      return 'Passwords do not match.'
    }
    return true
  }

  handleChangePassword(password) {
    this.setState({
      password,
    })
  }

  handleChangeConfirmPassword(confirmPassword) {
    this.setState({
      confirmPassword,
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const isPasswordValid = this.validatePassword(this.state.password)
    const isConfirmPasswordValid = this.validateConfirmPassword(this.state.confirmPassword)

    if (isPasswordValid !== true || isConfirmPasswordValid !== true) {
      return
    }

    this.props.onSubmit(this.state.password)
  }

  render() {
    const isPasswordValid = this.validatePassword(this.state.password)
    const isConfirmPasswordValid = this.validateConfirmPassword(this.state.confirmPassword)
    const isSubmitDisabled = isPasswordValid !== true || isConfirmPasswordValid !== true

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Change Password</h3>
        </div>
        <div className="panel-body">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <FormGroup
              type="password"
              id="password"
              label="Password"
              validate={this.validatePassword}
              onChange={this.handleChangePassword}
            />
            <FormGroup
              type="password"
              id="confirmPassword"
              label="Confirm Password"
              validate={this.validateConfirmPassword}
              onChange={this.handleChangeConfirmPassword}
            />
            <div className={`form-group ${!this.props.error ? 'no-margin-bottom' : ''}`}>
              <div className="col-sm-9 col-sm-offset-3">
                <button type="submit" className="btn btn-default" disabled={isSubmitDisabled}>Change Password</button>
              </div>
            </div>
            {
              this.props.error &&
              <div className="form-group no-margin-bottom">
                <div className="col-sm-9 col-sm-offset-3">
                  <p className="text-danger no-margin-bottom">
                    {this.props.error}
                  </p>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    )
  }
}

export default ProfileView