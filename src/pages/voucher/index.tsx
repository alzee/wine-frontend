import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { AtList, AtListItem, AtCard } from "taro-ui"
import { AtNavBar } from 'taro-ui'
import Taro from '@tarojs/taro'
import { Env } from '../../env/env'

export default class Voucher extends Component<PropsWithChildren> {
  query: string = '?page=1&itemsPerPage=20'
  list = []
  orgId: int

  componentWillMount () { }

  componentDidMount () {
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.orgId = res.data.org.id
        const self = this;
        this.query = '?page=1&itemsPerPage=20&org=' + this.orgId
        Taro.request({
          url: Env.apiUrl + 'vouchers' + this.query,
          success: function (res) { self.setState({data: res.data}) }
        }).then((res) =>{
          let records = res.data
          for (let i in records) {
            this.list.push(
              <AtListItem
              title={records[i].type}
              note={records[i].date}
              extraText={records[i].voucher / 100}
              // arrow='right'
              />
            )
          }
        })
      },
      fail: res => {
        console.log('fuck')
      },
    });

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='voucher'>
      <AtList className="list">
      {this.list}
      </AtList>
      </View>
    )
  }
}
