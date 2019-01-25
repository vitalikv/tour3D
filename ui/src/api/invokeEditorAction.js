export const invokeEditorAction = ({ name, value }) => {
  const EditorInvokeFunction = window.EditorInvokeFunction;

  try {
    if (typeof EditorInvokeFunction === 'function') {
      EditorInvokeFunction(name, value);
    }
    
    console.log(`Invoke ${name} :`, value);
  } catch (e) {
    console.error(e);
  }
}

if (process.env.NODE_ENV !== 'production') {
  const EditorInvokeFunction = (name, value, ...restProps) => {
    if (typeof window[value] === 'function') {
      window[value](restProps);
    }
  }

  window.EditorInvokeFunction = EditorInvokeFunction;
}
