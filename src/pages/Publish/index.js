import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'  // 导入样式
import { useEffect, useState } from 'react'
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
  const [searchParams] = useSearchParams()
  // useSearchParams 是 React Router 的 Hook，它：
  // 已经内置了状态管理：当 URL 中的查询参数变化时，组件会自动重新渲染
  // 响应式：searchParams 的变化会触发组件更新
  const articleId = searchParams.get('id')

  // html/css/开发者咨询...
  const { channelList } = useChannel()

  // 上传图片列表
  const [imageList, setImageList] = useState([])
  const onUploadChange = (info) => {
    // console.log(info);
    // {file: {response : { data: { url: // "http://geek.itheima.net/uploads/17.jpg" }, message: 'OK' } }, 
    // fileList: [{name: 'cat.jpg', response: data : { url: 'http://geek.itheima.net/uploads/17.jpg' } , message: OK ...}...]}
    setImageList(info.fileList)
  }

  // 切换cover类型 单图/无图/三图
  const [coverType, setCoverType] = useState(0)
  const onTypeChange = (e) => {
    const type = e.target.value
    setCoverType(type)
  }

  // 提交表单 新增文章 / 更新文章
  const onFinish = (formValue) => {
    // console.log(formValue);
    // { title: '第一篇', channel_id: 1, type: 1, content: '<p>懂得都懂</p>' }

    if (imageList.length !== coverType) return message.warning('封面类型和图片数量不匹配')
    const { title, content, channel_id } = formValue
    // 1. 安装后端API文档的格式 处理收集到的 表单数据
    const formatUrl = (list) => {
      return list.map(item => {
        if (item.response) {
          return item.response.data.url
        } else {
          return item.url
        }
      })
    }
    //    请求参数cover中 传递样例为一个对象
    //    { type: 0, images: []  }（无图）
    //    { type: 1, images: ['地址1']  }（单图)
    //    { type: 3, images: ['地址1'，'地址2'，'地址3']  } (三图)

    // imageList = [{name: 'cat.jpg', response: data : { url: 'http://geek.itheima.net/uploads/17.jpg' } , message: OK ...}...]
    // imageList.map(item => item.response.data.url) -> [{'http://geek.itheima.net/uploads/17.jpg'},[{....}]]
    const reqBody = {
      title: title,
      content: content,
      cover: {
        type: coverType, // 封面类型 单图/无图/三图

        // [ uid: "__AUTO__1771400073728_0__" , url:"http://geek.itheima.net/uploads/177" , ...] 
        images: formatUrl(imageList) // 图片列表
      },
      channel_id: channel_id
    }
    // 2. 调用接口 提交
    articleId ? updateArticleAPI({ ...reqBody, id: articleId }) : createArticleAPI(reqBody)
  }

  // 编辑/更新 某一文章 
  const [form] = Form.useForm()

  useEffect(() => {
    if (!articleId) return;
    const getArticle = async () => {
      const res = await getArticleById(articleId)
      const { cover } = res.data
      // console.log(res)
      // 1. 回填表单数据
      // form 数据回填 要求 set方法-> { type : 3 } 
      form.setFieldsValue({
        ...res.data,
        type: cover.type,
      })
      // 2. 回填封面和图片
      setCoverType(cover.type) // 封面类型
      setImageList(cover.images.map(url => ({ url: url }))) // 图片list
    }
    getArticle()
  }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          // Breadcrumb "面包屑导航"，如「首页 > 电子产品 > 手机」这样的层级路径提示。
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            // title 条件渲染 适配不同状态下的文案
            { title: `${articleId ? '编辑文章' : '发布文章'}` }
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题!' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map(item =>
                <Option key={item.id} value={item.id}>{item.name}</Option>)}
              {/* value属性 用户选中后 会自动收集起来 作为给后端接口提交的字段 */}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>

            {coverType > 0 &&
              /* listType 决定选择文件框的外观样式
              showUploadList 控制显示的上传列表 */
              <Upload
                listType="picture-card"
                showUploadList
                // action: 上传的后端地址
                action={'http://geek.itheima.net/v1_0/upload'}
                // name: 后端要求的字段 即参数名称
                name="image"
                onChange={onUploadChange}
                maxCount={coverType}
                // 找到限制上传数量的组件属性
                // 绑定控制
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>}

          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              theme="snow"
              // value={value}
              // onChange={setValue}
              style={{ height: '400px' }}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish