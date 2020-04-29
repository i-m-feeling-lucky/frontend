import Role from '@/utils/role';

const exampleUser = [
  {
    email: 'admin@lucky.com',
    name: '高贵的管理员',
    role: Role.ADMIN,
    password: 'admin',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'hr@lucky.com',
    name: '我是HR',
    role: Role.HR,
    password: 'hr',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'hr2@lucky.com',
    name: '我也是HR',
    role: Role.HR,
    password: 'hr',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'interviewer@lucky.com',
    name: '面试官苦力',
    role: Role.INTERVIEWER,
    password: 'interviewer',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
];

export default (email: string, password: string) => {
  const targetUser = exampleUser.find((user) => (user.email === email));
  if (targetUser === undefined) {
    return Promise.reject(new Error('找不到该账户'));
  }
  if (targetUser.password === password) {
    return Promise.resolve({
      data: {
        name: targetUser.name,
        role: targetUser.role,
        token: targetUser.token,
      },
    });
  }
  return Promise.reject(new Error('密码错误'));
};
