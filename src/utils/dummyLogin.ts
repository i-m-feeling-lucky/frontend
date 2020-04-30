
const exampleUser = [
  {
    email: 'admin@lucky.com',
    name: '高贵的管理员',
    role: 0,
    password: 'admin',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'hr@lucky.com',
    name: '我是HR',
    role: 1,
    password: 'hr',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'hr2@lucky.com',
    name: '我也是HR',
    role: 1,
    password: 'hr',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
  {
    email: 'interviewer@lucky.com',
    name: '面试官苦力',
    role: 2,
    password: 'interviewer',
    token: Math.random().toString(36).replace(/[^a-z]+/g, ''),
  },
];

export default async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
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
