import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OmniAural from 'omniaural'
import type { Episode, MediaRef, Playlist } from 'podverse-shared'
import { useState } from 'react'
import { ClipListItem, ColumnsWrapper, EpisodeListItem, List, PageScrollableContent,
  PlaylistPageHeader } from '~/components'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { Page } from '~/lib/utility/page'
import { getServerSideUserQueueItems } from '~/services/userQueueItem'
import { combineAndSortPlaylistItems, getPlaylist, updatePlaylist } from '~/services/playlist'

interface ServerProps extends Page {
  serverPlaylist: Playlist
  serverPlaylistSortedItems: [Episode | MediaRef]
}

const keyPrefix = 'pages_playlist'

export default function Playlist({ serverPlaylist, serverPlaylistSortedItems }: ServerProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [playlist, setPlaylist] = useState<Playlist>(serverPlaylist)
  const [editingPlaylistTitle, setEditingPlaylistTitle] = useState<string>(serverPlaylist.title)
  const [editingPlaylistIsPublic, setEditingPlaylistIsPublic] =
    useState<boolean>(serverPlaylist.isPublic)
  const pageTitle = playlist.title || t('untitledPlaylist')

  /* Render Helpers */

  const generatePlaylistItemElements = (playlistItems: any[]) => {
    return playlistItems.map((playlistItem, index) => {
      if (!playlistItem.pubDate) {
        const mediaRef = playlistItem
        return (
          <ClipListItem
            /* *TODO* Remove the "as any" below without throwing a Typescript error */
            episode={mediaRef.episode as any}
            handleRemove={() => console.log('remove clip')}
            key={`${keyPrefix}-clip-${index}`}
            mediaRef={mediaRef}
            podcast={mediaRef.episode.podcast as any}
            showImage
            showRemoveButton={isEditing} />
        )
      } else {
        const episode = playlistItem
        return (
          <EpisodeListItem
            /* *TODO* Remove the "as any" below without throwing a Typescript error */
            episode={episode}
            handleRemove={() => console.log('remove episode')}
            key={`${keyPrefix}-episode-${index}`}
            podcast={episode.podcast as any}
            showImage
            showRemoveButton={isEditing} />
        )
      }
    })
  }

  /* Commenting out since all playlists are by default Only With Link right now */
  // const _handleChangeIsPublic = async (selectedItems: any[]) => {
  //   const selectedItem = selectedItems[0]
  //   const isPublic = selectedItem.key === PV.Playlists.privacyKeys.public
  //   const playlistData = {
  //     id: playlist.id,
  //     title: editingPlaylistTitle || '',
  //     isPublic
  //   }
  //   OmniAural.pageIsLoadingShow()
  //   const newPlaylist = await updatePlaylist(playlistData)
  //   setPlaylist(newPlaylist)
  //   OmniAural.pageIsLoadingHide()
  // }

  const _handleEditCancel = () => {
    setIsEditing(false)
    setEditingPlaylistTitle(playlist.title)
  }

  const _handleEditSave = async () => {
    const playlistData = {
      id: playlist.id,
      title: editingPlaylistTitle || '',
      isPublic: editingPlaylistIsPublic
    }
    OmniAural.pageIsLoadingShow()
    const newPlaylist = await updatePlaylist(playlistData)
    setPlaylist(newPlaylist)
    OmniAural.pageIsLoadingHide()
    setIsEditing(false)
  }

  const _handleEditStart = () => {
    setIsEditing(true)
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PlaylistPageHeader
        // handleChangeIsPublic={_handleChangeIsPublic}
        handleEditCancel={_handleEditCancel}
        handleEditSave={_handleEditSave}
        handleEditStart={_handleEditStart}
        handlePlaylistTitleOnChange={setEditingPlaylistTitle}
        isEditing={isEditing}
        playlist={playlist} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <List>
                {generatePlaylistItemElements(serverPlaylistSortedItems)}
              </List>
            </>
          }
        />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params, req } = ctx
  const { cookies } = req
  const { playlistId } = params

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)
  const userQueueItems = await getServerSideUserQueueItems(cookies)

  const playlist = await getPlaylist(playlistId as string)

  const sortedPlaylistItems = combineAndSortPlaylistItems(playlist.episodes,
    playlist.mediaRefs, playlist.itemsOrder) as any

  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverCookies: cookies,
    serverPlaylist: playlist,
    serverPlaylistSortedItems: sortedPlaylistItems
  }

  return {
    props: serverProps
  }
}