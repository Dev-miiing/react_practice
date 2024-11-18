import { useLocation, useParams } from "react-router-dom";

export const NoticeRouter = () => {
  const { noticeIdx } = useParams();
  const { state } = useLocation();
  return (
    <>
      다이나믹 라우터로 변경된 url의 값: {noticeIdx}
      useLocation이란? url 변경될 때 상태값을 넘겨서 받아오는 값: {state.title}
    </>
  );
};
