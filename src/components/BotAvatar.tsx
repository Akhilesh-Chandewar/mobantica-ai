import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function BotAvatar() {
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage className="p-1" src="https://media.licdn.com/dms/image/v2/C5103AQHWWn1uz5cCKA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1554289165544?e=2147483647&v=beta&t=XxtHKszNhDxYBv-IKzN1-IZb0bx61ftSPPYiqeFsg2E" />
                <AvatarFallback>
                    <p>M</p>
                </AvatarFallback>
        </Avatar>
    )
}

export default BotAvatar