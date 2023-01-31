import { Component, PropsWithChildren } from 'react'
import { View, Text, Form, Button } from '@tarojs/components'
import { Input } from '@nutui/nutui-react-taro';
import './index.scss'
import { Env } from '../../env/env'
import Taro from '@tarojs/taro'
import { AtButton, AtList, AtListItem, AtImagePicker } from "taro-ui"
import { Taxon } from '../../Taxon'

export default class Orgedit extends Component<PropsWithChildren> {
  role: int
  oid: int
  state = {}

  componentDidMount () {
    self = this
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.setState({data: res.data})
        this.role = res.data.role
        this.oid = res.data.org.id
        Taro.request({
          url: Env.apiUrl + 'orgs/' + this.oid,
          success: function (res) { }
        }).then((res) =>{
          self.setState({
            org: res.data,
            image: [
              { url:Env.imgUrl + 'org/' + res.data.img }
            ]
          })
        })
      }
    })
  }

  imageSelected(image){
    console.log(image);
    this.setState({
      image 
    })
  }

  formSubmit = e => {
    console.log(e);
    let data = e.detail.value
    let label = {
      // name: '名称',
      contact: '联系人',
      phone: '电话',
      address: '地址',
      district: '区域',
    }
    for (let i in label) {
      if (data[i] == "") {
        Taro.showToast({
          title: '请填写 ' + label[i],
          icon: 'error',
          duration: 2000
        })
        return
      }
    }
    // console.log(data)
    Taro.request({
      method: 'PATCH',
      data: data,
      url: Env.apiUrl + 'orgs/' + this.oid,
      header: {
        'content-type': 'application/merge-patch+json'
      },
      success: function (res) { }
    }).then((res) =>{
      Taro.showToast({
        title: '已完成',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(
            () => {
              Taro.navigateBack()
            }, 500
          )
        }
      })
    })

    if (this.state.image[0].file) {
      Taro.uploadFile({
        url: Env.apiUrl + 'media_objects',
        filePath: this.state.image[0].file.path,
        name: 'upload',
        formData: {
          'type': 0,
          'entityId': this.oid
        },
        success (res){
        }
      })
    }
  }

  render () {
    return (
      <View className='orgEdit main'>
      { this.state.org &&
      <Form className='form'
      onSubmit={this.formSubmit}
      >
        <Input 
          label='名称'
          required
          // name='name' 
          type='text' 
          defaultValue={this.state.org.name}
          disabled
        />
        <Input 
          label='联系人'
          name='contact' 
          type='text' 
          required
          defaultValue={this.state.org.contact}
        />
        <Input 
          label='电话'
          name='phone' 
          type='number' 
          required
          defaultValue={this.state.org.phone}
        />
        <Input 
          label='地址'
          name='address' 
          type='text' 
          required
          defaultValue={this.state.org.address}
        />
        <Input 
          label='地区'
          name='district' 
          type='text' 
          required
          defaultValue={this.state.org.district}
        />
        <Input 
          label='收款人'
          name='payee' 
          type='text' 
          defaultValue={this.state.org.payee}
        />
        <Input 
          label='开户行'
          name='bank' 
          type='text' 
          defaultValue={this.state.org.bank}
        />
        <Input 
          label='收款账号'
          name='bankAccount' 
          type='text' 
          defaultValue={this.state.org.bankAccount}
        />
        <Input 
          label='开户地址'
          name='bankAddr' 
          type='text' 
          defaultValue={this.state.org.bankAddr}
        />
        <View className='label'>
        <View>
        图片
        <View className='note'>
        上传后将裁剪为2:1比例，请选择合适的图片
        </View>
        </View>
        <AtImagePicker
        className='image-picker'
        mode='aspectFit'
        count={1}
        length={1}
        files={this.state.image}
        onChange={this.imageSelected.bind(this)}
        />
        </View>
        <Button className='btn' formType='submit'>保存</Button>
      </Form>
      }
      </View>
    )
  }
}
