import { Component, PropsWithChildren } from 'react'
import { View, Text, Form, Button, Input, Checkbox, CheckboxGroup, Navigator, Image } from '@tarojs/components'
import { Input as input } from '@tarojs/components'
import './index.scss'
import { Env } from '../../env/env'
import Taro from '@tarojs/taro'
import { Taxon } from '../../Taxon'

export default class Consumerinfo extends Component<PropsWithChildren> {
  cid: int
  state = {
    btnDisabled: true,
    isNew: true,
  }

  componentDidMount () { 
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.cid = res.data.cid
        Taro.request({
          url: Env.apiUrl + 'consumers/' + this.cid,
        }).then((res) => {
          if (res.data.phone !== undefined && res.data.name !== undefined) {
            this.setState({
              btnDisabled: false,
              isNew: false
            })
          }
          this.setState({
            name: res.data.name,
            nick: res.data.nick,
            phone: res.data.phone,
            avatarUrl: Env.imgUrl + 'avatar/' + res.data.avatar
          })
        })
      }
    })
  }

  formSubmit = e => {
    let data = e.detail.value

    if (data.name == '') {
      Taro.showToast({
        title: '请填写姓名',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (data.phone == '') {
      Taro.showToast({
        title: '请填写电话',
        icon: 'error',
        duration: 2000
      })
      return
    }
    
    Taro.request({
      method: 'PATCH',
      data: data,
      url: Env.apiUrl + 'consumers/' + this.cid,
      header: {
        'content-type': 'application/merge-patch+json'
      }
    }).then((res) =>{
      Taro.showToast({
        title: '已完成',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(
            () => {
              Taro.reLaunch({url: '/pages/me/index'})
            }, 500
          )
        }
      })
    })

    if (this.state.avatarChanged) {
      let that = this
      Taro.uploadFile({
        url: Env.apiUrl + 'media_objects',
        filePath: this.state.avatarUrl,
        name: 'upload',
        formData: {
          'type': 6,
          'entityId': this.cid
        },
        success (res){
          that.setState({
            avatarUrl: res.data.url
          })
        }
      })
    }
  }

  checkboxChange(e){
    let s
    if (e.detail.value[0] == 'checked') {
      s = false
    } else {
      s = true
    }
    this.setState({
      btnDisabled: s
    })
  }

  onChooseAvatar = (e) =>{
    this.setState({
      avatarUrl: e.detail.avatarUrl,
      avatarChanged: true
    })
  }

  updateName = (e) => {
    this.setState({
        name: e.detail.value
    })
  }
  updateNick = (e) => {
    this.setState({
        nick: e.detail.value
    })
  }
  updatePhone = (e) => {
    this.setState({
        phone: e.detail.value
    })
  }

  render () {
    return (
      <View className='consumerInfo main'>
      <View className='hint'>
        { this.state.isNew &&
        <Text>请完善姓名及电话</Text>
        }
      </View>

      { this.state &&
      <Form className='form'
      onSubmit={this.formSubmit}
      >
      <Button class='avatar-wrapper' openType='chooseAvatar' onChooseAvatar={this.onChooseAvatar}>
        <Image class='avatar' src={this.state.avatarUrl}></Image>
      </Button>
        <View className='input'>
        <Text className='label'>姓名</Text>
        <Input 
          name='name' 
          type='text' 
          value={this.state.name}
          onBlur={this.updateName}
        />
        </View>
        <View className='input'>
        <Text className='label'>昵称</Text>
        <input 
          name='nick' 
          type='nickname' 
          value={this.state.nick}
          onBlur={this.updateNick}
        />
        </View>
        <View className='input'>
        <Text className='label'>电话</Text>
        <Input 
          name='phone' 
          type='text' 
          value={this.state.phone}
          onBlur={this.updatePhone}
        />
        </View>

        { this.state.isNew &&
        <View className='d-flex'>
        <CheckboxGroup onChange={this.checkboxChange.bind(this)}>
        <Checkbox value='checked'></Checkbox>
        </CheckboxGroup>
        我已阅读并同意<Navigator url='/pages/node/policy'>《用户协议》</Navigator>
        </View>
        }
        <Button className='btn' formType='submit' disabled={this.state.btnDisabled}>提交</Button>
      </Form>
      }
      </View>
    )
  }
}
