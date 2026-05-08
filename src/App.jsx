import { useState } from 'react'
import NicknameScreen from './components/NicknameScreen'
import GroupStage from './components/GroupStage'
import KnockoutScreen from './components/KnockoutScreen'
import PredictionsFeed from './components/PredictionsFeed'

export default function App() {
  const [screen, setScreen] = useState('nickname')
  const [nickname, setNickname] = useState('')
  const [groupPicks, setGroupPicks] = useState(null)

  function handleNicknameSubmit(name) {
    setNickname(name)
    setScreen('groups')
  }

  function handleGroupsNext(picks) {
    setGroupPicks(picks)
    setScreen('knockout')
  }

  function handleKnockoutSubmit() {
    setScreen('feed')
  }

  if (screen === 'feed') {
    return <PredictionsFeed nickname={nickname} />
  }

  if (screen === 'knockout') {
    return (
      <KnockoutScreen
        nickname={nickname}
        groupPicks={groupPicks}
        onSubmit={handleKnockoutSubmit}
      />
    )
  }

  if (screen === 'groups') {
    return <GroupStage nickname={nickname} onNext={handleGroupsNext} />
  }

  return <NicknameScreen onSubmit={handleNicknameSubmit} onViewFeed={() => setScreen('feed')} />
}
