import * as React from 'react';
import styled from 'styled-components';

import { handleFormSubmit } from '../../utils/form-utils';
import { colors } from '../../global/colors';
import { ContactType } from './contact.component';

interface ContactPageFormProps {
  contactType: ContactType;
}

interface ContactPageFormState {
  submitted: boolean;
  [key: string]: any;
}

const SingleInputWrapper = styled.div`
  margin-bottom: 20px;
`;

const ILabel = styled.label`
  color: ${colors.titleBlue};
  padding-top: 0;
`;

const ISpan = styled.span`
  position: relative;
  display: block;
  width: 100%;
  margin-top: 5px;
`;

const IInput = styled.input`
  margin: 0;
  vertical-align: baseline;
  width: 100%;

  appearance: none;

  font-weight: 400;
  font-size: 1.6rem;
  color: ${colors.titleGreen};
  padding: 5px 10px;

  outline: none;
  line-height: 28px;

  background-color: #032e74;
  border: 1px solid #12ffcd;
  box-shadow: 0px 0px 0px 0px #e6e9ec;
`;

const ITextarea = styled.textarea`
  margin: 0;
  vertical-align: baseline;
  width: 100%;

  appearance: none;

  box-shadow: inset 0 2px 0 rgba(84, 94, 111, 0.2);

  font-weight: 400;
  font-size: 1.6rem;
  color: ${colors.titleGreen};
  padding: 5px 10px;

  outline: none;
  line-height: 28px;

  background-color: #032e74;
  border: 1px solid #12ffcd;
  box-shadow: 0px 0px 0px 0px #e6e9ec;
`;

const IInvisible = styled.input`
  visibility: hidden;
`;

const ISubmit = styled.input`
  position: relative;
  height: 56px;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  background-color: ${colors.actionPurple};

  font-family: MonoRegular;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.white};
  text-transform: uppercase;
  line-height: 56px;
  text-decoration: none;
  border: none;
  width: 50%;
`;

export class ContactPageForm extends React.Component<
  ContactPageFormProps,
  ContactPageFormState
> {
  constructor(props: ContactPageFormProps) {
    super(props);

    console.log('CONTACT TYpE:', this.props.contactType);

    this.state = {
      submitted: false,
      name: '',
      email: '',
      message: ''
    };
  }

  public handleChange(e: any) {
    this.setState({ [e.target.name]: e.target.value });
  }

  public handleSubmit(event: React.FormEvent<EventTarget>) {
    handleFormSubmit(event, this.state).then(() => {
      this.setState({ submitted: true });
    });
  }

  public render() {
    let formName = 'contact-page-form';

    if (this.props.contactType && this.props.contactType !== 'contact') {
      formName = `${this.props.contactType}-page-form`;
    }

    return (
      <div>
        {this.state.submitted && (
          <div>Thank you. We will get back to you shortly.</div>
        )}

        {!this.state.submitted && (
          <form
            name={formName}
            method="post"
            onSubmit={e => this.handleSubmit(e)}
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value={formName} />

            <SingleInputWrapper>
              <ILabel>
                Name *
                <ISpan>
                  <IInput
                    type="text"
                    name="name"
                    required
                    onChange={e => this.handleChange(e)}
                    value={this.state['name']}
                  />
                </ISpan>
              </ILabel>
            </SingleInputWrapper>

            <SingleInputWrapper>
              <ILabel>
                Email *
                <ISpan>
                  <IInput
                    type="email"
                    name="email"
                    required
                    onChange={e => this.handleChange(e)}
                    value={this.state['email']}
                  />
                </ISpan>
              </ILabel>
            </SingleInputWrapper>

            <SingleInputWrapper>
              <ILabel>
                Message *
                <ISpan>
                  <ITextarea
                    name="message"
                    required
                    onChange={e => this.handleChange(e)}
                    value={this.state['message']}
                  />
                </ISpan>
              </ILabel>
            </SingleInputWrapper>

            <div data-netlify-recaptcha />

            <SingleInputWrapper style={{ textAlign: 'center' }}>
              <ISubmit type="submit" value="Send" />
            </SingleInputWrapper>

            <IInvisible
              name="form-type"
              readOnly
              value={this.props.contactType}
            />

            <IInvisible name="bot-field" onChange={e => this.handleChange(e)} />
          </form>
        )}
      </div>
    );
  }
}
