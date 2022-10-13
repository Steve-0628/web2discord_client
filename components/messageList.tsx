import { MessageProtocol, UserProtocol } from "../utils/protocol"
import MessageBox from "./messageBox"

interface Props {
    users: Record<string, UserProtocol>
    messages: MessageProtocol[]
}

const MessageList = ({ users, messages }: Props) => {
    return (
        <>
            {messages.map((message) => {
                const user = users[message.authorId]

                const username = user ? user.username : message.tag

                return <MessageBox username={username} message={message} key={message.id} />
            })}
        </>
    )
}

export default MessageList
