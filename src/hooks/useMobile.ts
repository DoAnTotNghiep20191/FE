import { Grid } from 'antd';
const { useBreakpoint } = Grid;
export function useMobile() {
  const { md, lg, xl, xxl } = useBreakpoint();
  return !md && !lg && !xl && !xxl;
}
