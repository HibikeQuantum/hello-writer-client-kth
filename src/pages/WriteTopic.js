import React, { Component } from "react";
import { Button, Icon, Input, Tooltip } from "antd";
import SERVER_URL from "../config/config";

class WriteTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWriteTopic: this.props.data.currentWriteTopic,
      renderInput: false,
      userIssueBoolean: false
    };
  }

  getTopic = () => {
    console.log("getTopic호출!");
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

    fetch(`${SERVER_URL}/topics/random`, {
      method: "GET",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        accessToken,
        refreshToken
      }
    })
      .then(res => res.json())
      .then(str => {
        this.setState({ currentWriteTopic: str });
        this.props.changeCurrentWriteTopic(str, false);
      })
      .catch(err => console.log(err));
  };
  goWrite = () => {
    this.props.history.push("/write");
  };
  toggleInputBox = () => {
    this.setState(
      {
        renderInput: !this.state.renderInput,
        userIssueBoolean: !this.state.userIssueBoolean
      },
      () => {
        if (this.state.userIssueBoolean === false) {
          this.getTopic();
          console.log("다시 정규 이슈 복귀");
        } else {
          console.log("사용자 이슈 모드");
        }
      }
    );
  };

  componentDidMount() {
    if (!this.props.data.currentUserId) {
      this.props.history.push("/");
    }
    this.getTopic();
  }

  inputOnChangeHandle = e => {
    this.setState({ currentWriteTopic: e.target.value });
    this.props.changeCurrentWriteTopic(e.target.value, true);
    console.log("handleIssueInput", this.state.currentWriteTopic);
  };

  onBlur = () => {
    console.log("탈출!");
  };

  render() {
    const title = "당신이 발행한 이슈는 다른 사람들도 쓰게되요~";
    return (
      <div>
        <div className="TopicBox">
          <div className="Topic-TEXT">{this.state.currentWriteTopic}</div>
          <Button className="newTopic-Button" onClick={this.getTopic}>
            <Icon type="reload" />
            새로운 주제 받기
          </Button>
          <br />
          <Button
            className="myIssue-Button"
            onClick={this.toggleInputBox}
            type="default"
          >
            직접선정
            <Icon type="rocket" />
          </Button>
          {this.state.renderInput ? (
            <Tooltip trigger={["focus"]} title={title} placement="topLeft">
              <Input
                onChange={this.inputOnChangeHandle}
                onBlur={this.onBlur}
                maxLength={30}
                autoFocus={true}
                onPressEnter={() => {
                  this.setState({ renderInput: false });
                }}
              />
            </Tooltip>
          ) : null}
          <br />
          <Button
            className="goWrite-Button"
            onClick={this.goWrite}
            type="primary"
          >
            맘에들어
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default WriteTopic;
