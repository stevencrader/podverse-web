import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategoriesByQuery, getPodcastsByQuery } from '~/services'
import { pageIsLoading } from '~/redux/actions'
import PodcastListCtrl from '~/components/PodcastListCtrl/PodcastListCtrl';

type Props = {
  allCategories?: any[]
  listItems?: any
  playerQueue?: any
  queryCategoryId?: any
  queryPage: number
  querySort?: any
}

type State = {}

class Podcasts extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { settings, user } = state
    const { nsfwMode } = settings
    const selectedCategoryId = query.categories

    const allCategoriesResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesResult.data || []
    
    const queryDataResult = await getPodcastsByQuery(query, nsfwMode)
    const listItems = queryDataResult.data

    store.dispatch(pageIsLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { allCategories, listItems, query, queryFrom, querySort, queryType,
      selectedCategoryId, user }
  }

  render() {
    const { allCategories, listItems, queryCategoryId, queryPage, querySort
      } = this.props
    
    return (
      <PodcastListCtrl 
        allCategories={allCategories}
        listItems={listItems}
        queryCategoryId={queryCategoryId}
        queryPage={queryPage}
        querySort={querySort} />
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Podcasts)
