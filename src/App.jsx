import { useState } from 'react'
import NicknameScreen from './components/NicknameScreen'
import GroupStage from './components/GroupStage'

export default function App() {
  const [screen, setScreen] = useState('nickname')
  const [nickname, setNickname] = useState('')

  function handleNicknameSubmit(name) {
    setNickname(name)
    setScreen('groups')
  }

  function handleGroupsNext(picks) {
    console.log('group picks:', picks)
  }

  if (screen === 'groups') {
    return <GroupStage nickname={nickname} onNext={handleGroupsNext} />
  }

  return <NicknameScreen onSubmit={handleNicknameSubmit} />
}
