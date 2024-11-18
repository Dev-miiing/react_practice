import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  IDetailResponse,
  INoticeDetail,
  IPostResponse,
} from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { Form } from "react-router-dom";
import { blob } from "stream/consumers";

interface INoticeModalProps {
  onSuccess: () => void;
  noticeSeq: number;
  setNoticeSeq: (noticeSeq: number) => void;
}

export const NoticeModal: FC<INoticeModalProps> = ({
  onSuccess,
  noticeSeq,
  setNoticeSeq,
}) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();

  useEffect(() => {
    noticeSeq && searchDetail();

    return () => {
      noticeSeq && setNoticeSeq(undefined);
    };
  }, []);

  const searchDetail = async () => {
    const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, {
      noticeSeq,
    });

    if (detail) {
      setNoticeDetail(detail.detail);
      const { fileExt, logicalPath } = detail.detail;
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);
      } else {
        setImageUrl("");
      }
    }

    //axios
    //  .post("/board/noticeDetailBody.do", { noticeSeq })
    //  .then((res: AxiosResponse<IDetailResponse>) => {
    //    setNoticeDetail(res.data.detail);
    //  });
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  const handlerSave = async () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };
    const save = await postNoticeApi<IPostResponse>(Notice.getSave, param);

    if (save?.result === "success") {
      onSuccess();
    }
    //axios
    //  .post("/board/noticeSaveBody.do", param)
    //  .then((res: AxiosResponse<IPostResponse>) => {
    //    res.data.result === "success" && onSuccess();
    //  });
  };

  const handlerUpdate = async () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      noticeSeq,
    };

    const update = await postNoticeApi<IPostResponse>(Notice.getUpdate, param);

    if (update?.result === "success") {
      onSuccess();
    }

    //axios
    //  .post("/board/noticeUpdateBody.do", param)
    //  .then((res: AxiosResponse<IPostResponse>) => {
    //    res.data.result === "success" && onSuccess();
    //  });
  };

  const handlerFileUpdate = () => {
    const fileForm = new FormData();
    const textData = {
      title: title.current.value,
      context: context.current.value,
      noticeSeq,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
    );
    axios
      .post("/board/noticeUpdateFileForm.do", fileForm)
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  const handlerDelete = async () => {
    const param = {
      noticeSeq,
    };

    const postDelete = await postNoticeApi<IPostResponse>(
      Notice.getDelete,
      param
    );

    if (postDelete?.result === "success") {
      onSuccess();
    }

    //axios
    //  .post("/board/noticeDeleteBody.do", param)
    //  .then((res: AxiosResponse<IPostResponse>) => {
    //    res.data.result === "success" && onSuccess();
    //  });
  };

  //ChangeEvent는 제공되는 이벤트 변경시 바뀐 값들 제공해주는 뭐 내장 기능? 그런거
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    if (fileInfo?.length > 0) {
      const fileInfoSplit = fileInfo[0].name.split(".");
      const fileExtension = fileInfoSplit[1].toLowerCase();

      if (
        fileExtension === "jpg" ||
        fileExtension === "gif" ||
        fileExtension === "png"
      ) {
        setImageUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl("");
      }
      setFileData(fileInfo[0]);
    }
  };

  const downloadFile = async () => {
    const param = new URLSearchParams();
    param.append("noticeSeq", noticeSeq.toString());

    const postAction: AxiosRequestConfig = {
      url: "/board/noticeDownload.do",
      method: "post",
      data: param,
      responseType: "blob", //바이너리. 0과 1로 받겠다는 뜻
    };

    await axios(postAction).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", noticeDetail?.fileName as string);
      document.body.appendChild(link);
      link.click();

      link.remove();
    });
  };

  const handlerFileSave = () => {
    const fileForm = new FormData();
    const textData = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
      //new Blob 바이너리데이터로 보내주는 것
    );
    axios
      .post("/board/noticeSaveFileForm.do", fileForm)
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :
          <input
            type="text"
            ref={title}
            defaultValue={noticeDetail?.title}
          ></input>
        </label>
        <label>
          내용 :{" "}
          <input
            type="text"
            ref={context}
            defaultValue={noticeDetail?.content}
          ></input>
        </label>
        파일 :
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handlerFile}
        ></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div onClick={downloadFile}>
          {imageUrl ? (
            <div>
              <label>미리보기</label>
              <img src={imageUrl} />
              {fileData?.name}
            </div>
          ) : (
            <div>{fileData?.name}</div>
          )}
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? handlerFileUpdate : handlerFileSave}>
            {noticeSeq ? "수정" : "등록"}
          </button>
          {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={handlerModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
