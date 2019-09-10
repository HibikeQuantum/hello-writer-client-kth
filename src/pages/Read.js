/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { Component } from "react";
import { Button, message } from "antd";
import SERVER_URL from "../config/config";

class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curArticle: null,
      loading: false
    };
  }

  componentDidMount() {
    if (!this.props.data.currentUserId) {
      this.props.history.push("/");
    } else if (
      this.props.data.currentUserId &&
      this.props.data.currentReadTopic
    ) {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
      fetch(`${SERVER_URL}/topics?word=${this.props.data.currentReadTopic}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accessToken,
          refreshToken
        }
      })
        .then(res => res.json())
        .then(json => this.setState({ curArticle: json }))
        .catch(err => console.log(err));
    } else {
      this.getArticle();
    }
  }
  goMain = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => this.props.history.push("/main"), 200);
    });
  };

  getArticle = () => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
    fetch(`${SERVER_URL}/article/random`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accessToken,
        refreshToken
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json.success, "어떤 형태.");
        if (json.success === "NULL") {
          console.log("null셋팅 완료");
          this.state({ curArticle: null });
        } else {
          console.log("제대로 바다왔습니다. ", json);
          this.setState({ curArticle: json });
        }
      })
      .catch(err => console.log(err));
  };

  postEvaluation = async event => {
    this.setState({ loading: true });
    // 클릭한 평가 내용으로 post 요청(읽음 표시)
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
    fetch(`${SERVER_URL}/read`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accessToken,
        refreshToken
      },
      body: JSON.stringify({
        article_id: this.state.curArticle.id,
        user_id: this.props.data.currentUserId,
        rating: event.target.innerText
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ loading: false }, () => {
          message.success("당신의 평가를 고이고이 접어 보관했습니다. 📦");
          this.props.changeActivePoint(15);
        });
      })
      .catch(err => console.log(err, "프로미스 에러 "));
    this.getArticle();
  };

  render() {
    const { curArticle } = this.state;
    console.log(curArticle, "셋팅");
    return (
      <div>
        <div id="render-article-div">
          {this.state.curArticle !== null ? (
            <span> {this.state.curArticle.article_text}</span>
          ) : (
            <span>"article 재고가 떨어졌습니다.. ☠️"</span>
          )}
        </div>
        {this.state.curArticle !== null ? (
          <div>
            <Button loading={this.state.loading} onClick={this.postEvaluation}>
              별로
            </Button>
            <Button loading={this.state.loading} onClick={this.postEvaluation}>
              그냥
            </Button>
            <Button loading={this.state.loading} onClick={this.postEvaluation}>
              좋아
            </Button>
          </div>
        ) : (
          <Button loading={this.state.loading} onClick={this.goMain}>
            메인으로 돌아기기
          </Button>
        )}
      </div>
    );
  }
}

export default Read;
