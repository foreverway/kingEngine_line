import Base from '@/utils/base'
import IDict from '../../interface/dict'

/**
* 根据value获取字典项 如从性别中获取value=11的字典项
* @param dict 某类数据字典
* @param val 字典值
*/
const dictByItem = (val: string, items: IDict[]) => {
  let item = Base.dict.dictByItem(items, val)
  return item.dictName
}
export default dictByItem
