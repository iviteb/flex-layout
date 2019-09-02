import React from 'react'
import { defineMessages } from 'react-intl'

import {
  FlexLayoutTypes,
  useFlexLayoutContext,
  FlexLayoutContextProvider,
} from './components/FlexLayoutContext'
import { generateBlockClass } from '@vtex/css-handles'

import styles from './components/FlexLayout.css'

import {
  TachyonsScaleInput,
  parseTachyonsGroup,
  parseMargins,
  parsePaddings,
} from './modules/valuesParser'

enum VerticalAlign {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

enum HorizontalAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}

interface Props extends Flex, Gap {
  blockClass?: string
  height?: string
  marginLeft: TachyonsScaleInput
  marginRight: TachyonsScaleInput
  paddingLeft: TachyonsScaleInput
  paddingRight: TachyonsScaleInput
  preventVerticalStretch?: boolean
  verticalAlign?: VerticalAlign
  horizontalAlign?: HorizontalAlign
}

const parseVerticalAlign = (input?: string) => {
  switch (input) {
    case VerticalAlign.middle:
      return 'justify-center'
    case VerticalAlign.bottom:
      return 'justify-end'
  }
  return ''
}

const parseHorizontalAlign = (input?: string) => {
  switch (input) {
    case HorizontalAlign.center:
      return 'items-center'
    case HorizontalAlign.right:
      return 'items-end'
  }
  return ''
}

const Col: StorefrontFunctionComponent<Props> = ({
  children,
  blockClass,
  colGap,
  rowGap,
  marginLeft,
  marginRight,
  paddingLeft,
  paddingRight,
  grow,
  preventVerticalStretch,
  verticalAlign,
  horizontalAlign,
}) => {
  const context = useFlexLayoutContext()

  const gaps = parseTachyonsGroup({
    colGap: colGap != null ? colGap : context.colGap,
    rowGap: rowGap != null ? rowGap : context.rowGap,
  })

  const margins = parseMargins({
    marginLeft,
    marginRight,
  })

  const paddings = parsePaddings({
    paddingLeft,
    paddingRight,
  })

  if (context.parent === FlexLayoutTypes.COL) {
    console.warn(
      'A `flex-layout.col` is being inserted directly into another `flex-layout.col`. This might might have unpredicted behaviour.'
    )
  }

  if (context.parent === FlexLayoutTypes.NONE) {
    console.warn(
      'A `flex-layout.col` block is being inserted directly into the page, but it needs to be inserted into a `flex-layout.row` block.'
    )
    return null
  }

  const vertical = parseVerticalAlign(verticalAlign)
  const horizontal = parseHorizontalAlign(horizontalAlign)

  const rowsNum = React.Children.count(children)

  return (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.COL} {...gaps}>
      <div
        className={`${generateBlockClass(styles.flexCol, blockClass)} ${
          grow ? 'flex-grow-1' : ''
        } ${margins} ${paddings} ${vertical} ${horizontal} flex flex-column h-100 w-100`}
      >
        {React.Children.map(children, (row, i) => {
          const isLast = i === rowsNum - 1
          const rowGap = isLast ? 0 : gaps.rowGap

          return (
            <div
              key={i}
              className={`${generateBlockClass(
                styles.flexColChild,
                blockClass
              )} pb${rowGap}`}
              style={{
                height:
                  preventVerticalStretch || verticalAlign ? 'auto' : '100%',
              }}
            >
              {row}
            </div>
          )
        })}
      </div>
    </FlexLayoutContextProvider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.column.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.column.description',
  },
})

Col.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default Col
