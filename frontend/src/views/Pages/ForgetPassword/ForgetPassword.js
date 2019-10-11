import React, {Component} from 'react';
import {sendPasswordResetEmail} from "../../../controller/userManager";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {Link} from "react-router-dom";


const LinkButton = ({ text, to }) => (
  <Link to={to}>
    <Button color="link"><span>{text}</span></Button>
  </Link>
);

const EmailLogo = () => (
  <InputGroupAddon addonType="prepend">
    <InputGroupText>@</InputGroupText>
  </InputGroupAddon>
);

const EmailInput = ({ email, handleChange }) => (
  <InputGroup className="mb-3">
    <EmailLogo/>
    <Input type="email" id="email" placeholder="Email" autoComplete="email" value={email} onChange={handleChange}/>
  </InputGroup>
);

const ForgetPasswordForm = ({ email, message, handleSubmit, handleChange, isDisabled }) => (
  <Form onSubmit={handleSubmit}>
    <h1>Reset Password</h1>
    <p className="text-muted">Enter your email:</p>
    <EmailInput email={email} handleChange={handleChange}/>
    <FormText color="muted">{message}</FormText>
    <br/>
    <Button color="success" disabled={isDisabled} block>Send Reset Email</Button>
  </Form>
);

class ForgetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
    };
  }

  validateForm() {
    return this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({message: 'Email sent, please check your email for further action.'});
      })
      .catch(err => {
        console.log(err);
        this.setState({message: err.message});
      })
  };

  render() {
    const isDisabled = !this.validateForm();
    const { email, message } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <ForgetPasswordForm email={email} message={message} isDisabled={isDisabled} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
                  <br/>
                  <LinkButton to="/login" text="Ready to log in?"/>
                  <br/>
                  <LinkButton to="/register" text="Register a new account?"/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgetPassword;
