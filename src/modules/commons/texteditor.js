import { ContentState, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import htmlToDraft from "html-to-draftjs";
import { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { callProblemDetail } from "../../api/problem.api";
import { AppAction } from "../../helpers/object.helper";
import { SERVER_HOST, SERVER_PREFIX } from "../../configs/app.config";

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SERVER_HOST}${SERVER_PREFIX}/single-upload`);
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve({ data: { link: response.url } });
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

class EditorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    if (props.action === AppAction.UPDATE) {
      callProblemDetail(props.id).then((data) => {
        const problem = data.data;
        const blocksFromHtml = htmlToDraft(problem.problemQuestion);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        this.state.editorState = EditorState.createWithContent(contentState);
      });
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.handleChange(stateToHTML(editorState.getCurrentContent()));
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="editor">
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              uploadEnable: true,
              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
              uploadCallback: uploadImageCallBack,
              alt: { present: true, mandatory: true },
            },
          }}
        />
      </div>
    );
  }
}

export default EditorContainer;
