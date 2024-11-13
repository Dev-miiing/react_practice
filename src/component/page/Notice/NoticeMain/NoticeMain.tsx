import { useLocation } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRecoilState } from "recoil";
//import { modalState } from '../../../../stores/modalState';
import { Protal } from "../../../common/potal/Portal";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Button } from "react-bootstrap";

interface INoitce {
  author: string;
  content: string;
  createdDate: string;
  fileExt: string | null;
  fileName: string | null;
  fileSize: number;
  logicalPath: string | null;
  noticeIdx: number;
  phsycalPath: string | null;
  title: string;
  updatedDate: string | null;
}

export const NoticeMain = () => {
  return (
    <>
      총 갯수 : 0 현재 페이지 : 0
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
          </tr>
        </tbody>
      </StyledTable>
    </>
  );
};
