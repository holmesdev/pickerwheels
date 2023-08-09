import OptionEditor from './OptionEditor'
import OptionCreator from './OptionCreator'
import { Option } from './Option'
import { Dispatch, memo } from 'react'
import { WheelActions } from './wheelReducer'

function OptionsEditor({ options, dispatch }: { options: Option[]; dispatch: Dispatch<WheelActions> }) {
  return (
    <div className="flex flex-col">
      <OptionCreator onAdd={(label) => dispatch({ type: 'AddOption', label })} />
      {options.map((input) => (
        <OptionEditor
          key={input.id}
          option={input}
          onLabelChange={(label) => dispatch({ type: 'RenameOption', id: input.id, label })}
          onEnableChange={() => dispatch({ type: 'ToggleOption', id: input.id })}
          onCopy={() => dispatch({ type: 'CopyOption', id: input.id })}
          onDelete={() => dispatch({ type: 'RemoveOption', id: input.id })}
        />
      ))}
    </div>
  )
}

export default memo(OptionsEditor)
