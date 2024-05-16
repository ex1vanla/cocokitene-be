import { PartialType } from '@nestjs/mapped-types'
import { Emoji } from '@entities/reaction-icon.entity'
import { EmojiEnum } from '@shares/constants'

export class InsertEmojiDto extends PartialType(Emoji) {}

export const emojiData: InsertEmojiDto[] = [
    {
        key: EmojiEnum.INNOCENT,
        description: 'smile',
    },
]
