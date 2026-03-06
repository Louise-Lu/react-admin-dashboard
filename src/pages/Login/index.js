import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { useDispatch } from 'react-redux';
import { fetchLogin } from '@/store/modules/user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    console.log('Success:', values);
    dispatch(fetchLogin(values))
    navigate('/')
    message.success('登录成功')
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单  validateTrigger 统一设置字段触发验证的时机*/}
        <Form
          validateTrigger="onBlur"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="mobile" // 和后端接口校验名要一致
            rules={[{
              required: true,
              message: '请输入手机号'
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式'
            }
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login