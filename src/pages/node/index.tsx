import { Component, PropsWithChildren } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { Env } from '../../env/env'
import { AtNavBar } from 'taro-ui'

export default class Node extends Component<PropsWithChildren> {
  instance = Taro.getCurrentInstance();
  node = {};

  componentDidMount () {
    let id = this.instance.router.params.id
    const self = this;
    Taro.request({
      url: Env.apiUrl + 'nodes/' + id,
      success: function (res) { self.setState({data: res.data}) }
    }).then((res) =>{
      this.node = res.data
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='at-article'>
      <View className='at-article__h1'>
      {this.node.title}
      </View>
      <View className='at-article__info'>
      {this.node.date}
      </View>
      <Image 
      className='at-article__img' 
      src={Env.imgUrl + this.node.img}
      mode='widthFix' />
      <View className='at-article__content'>
      <View dangerouslySetInnerHTML={{__html: this.node.body}} className='at-article__section'>
      </View>
      </View>
      </View>
    )
  }
}
