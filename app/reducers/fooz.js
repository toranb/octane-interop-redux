export default function fooz(state, action) {
  if(action.type === 'UP') {
    return state + 1;
  }
  return state || 0;
}
