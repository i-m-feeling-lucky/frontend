/* eslint-disable import/prefer-default-export */
import roleMap from '@/utils/roleMap';

const interviews = [
  {
    id: 0,
    HRId: 1,
    interviewerId: 12,
    intervieweeId: 18,
    HRToken: '1f251805-b4ea-43a3-90a8-299abeb751e8',
    interviewerToken: '60cd9fda-c9b6-4670-b5a5-f6fdb7f9ef6a',
    intervieweeToken: '563455cd-3111-42e6-9a2a-8f344dd887de',
    startTime: Date.now() + 1000 * 60 * 24,
    length: 40,
  },
  {
    id: 1,
    HRId: 2,
    interviewerId: 8,
    intervieweeId: 4,
    HRToken: '7e4e8cdf-8c4a-4d60-9305-6ce031e43fbd',
    interviewerToken: 'bb1105e9-4da7-4097-929f-1ea0f3b1a8df',
    intervieweeToken: 'bfe61c90-66b4-4f3f-a3ee-cf6504ce82ed',
    startTime: Date.now() - 1000 * 60 * 24,
    length: 35,
  },
  {
    id: 2,
    HRId: 5,
    interviewerId: 22,
    intervieweeId: 11,
    HRToken: '141c83b0-294e-4214-89db-09edfc3b2704',
    interviewerToken: '47fc8855-62fb-45ec-8588-4563a1edd837',
    intervieweeToken: '9664eb59-5fff-40a9-ad66-1936d9d06ec6',
    startTime: Date.now() + 1000 * 60 * 2,
    length: 40,
  },
];

export async function dummyVerify(id: number, token: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const targetInterview = interviews.find((interview) => (interview.id === id));
  if (targetInterview === undefined) {
    return Promise.reject(new Error('找不到这场面试'));
  }
  if (targetInterview.HRToken === token) {
    return Promise.resolve(roleMap.indexOf('HR'));
  }
  if (targetInterview.interviewerToken === token) {
    return Promise.resolve(roleMap.indexOf('interviewer'));
  }
  if (targetInterview.intervieweeToken === token) {
    return Promise.resolve(roleMap.indexOf('interviewee'));
  }
  return Promise.reject(new Error('无效的 token！'));
}
