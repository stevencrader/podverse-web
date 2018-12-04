import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaContentView from '~/components/MediaContentView/MediaContentView'
import { getQueryDataForPodcastPage } from '~/lib/mediaListController'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { currentPageListItemsLoading, currentPageListItemsLoadingNextPage, currentPageLoadListItems,
  currentPageLoadPodcast, playerQueueLoadSecondaryItems } from '~/redux/actions'
import { getPodcastById } from '~/services/podcast'
import { clone } from '~/lib/utility'

type Props = {
  currentPage?: any
  playerQueue?: any
  queryFrom?: any
  querySort?: any
  queryType?: any
}

type State = {}

class Podcast extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { currentPage } = state
    const podcastResult = await getPodcastById(query.id)
    const podcast = podcastResult.data
    store.dispatch(currentPageLoadPodcast(podcast))

    const queryDataResult = await getQueryDataForPodcastPage(query, podcast.id)
    const newData = queryDataResult.data
    let combinedData: any[] = []

    // Only keep the currentPage.listItems if beyond the first page query
    // @ts-ignore
    if (process.browser && query.page && query.page > 1) {
      const { listItems } = currentPage
      combinedData = listItems
    }

    for (const data of newData) {
      combinedData.push(convertToNowPlayingItem(data))
    }

    store.dispatch(currentPageLoadListItems({
      listItems: combinedData,
      listItemsEndReached: combinedData && combinedData.length === 0
    }))
    store.dispatch(currentPageListItemsLoading(false))
    store.dispatch(currentPageListItemsLoadingNextPage(false))

    store.dispatch(playerQueueLoadSecondaryItems(clone(combinedData)))

    const { from: queryFrom, sort: querySort, type: queryType } = query

    return { queryFrom, querySort, queryType }
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { queryFrom, querySort, queryType } = this.props
    
    return (
      <MediaContentView
        queryFrom={queryFrom}
        querySort={querySort}
        queryType={queryType} />
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Podcast)
