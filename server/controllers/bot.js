import {
  noticeFromAdminService,
  noticeGetResult,
  noticeGroupWithPinService,
} from '../../modules/notice.js';

export async function postNoticeProtocol(req, res) {
  try {
    const { protocol } = req.body;
    const notice = await noticeGetResult(protocol);
    return res.status(200).json(notice);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
export async function postNoticeForAll(req, res) {
  try {
    const { message } = req.body;
    const notice = await noticeFromAdminService(message);
    return res.status(200).json(notice);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
export async function postNoticeGroupPin(req, res) {
  try {
    const { messageObg } = req.body;
    const notice = await noticeGroupWithPinService(messageObg);
    return res.status(200).json(notice);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
