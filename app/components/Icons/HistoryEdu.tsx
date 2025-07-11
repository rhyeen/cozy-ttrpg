import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function HistoryEduIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M323-170q-31 0-53-22t-22-53v-76.5q0-15.5 11-26.5t26.5-11H365v-92q-30.5-1-59.75-11.75T253.5-494q-5.5-5.5-9-12.5t-3.5-15V-550h-30q-7.5 0-14.5-2.75T184-561l-88-88.5q-11.5-11.5-10.75-27T97.5-703q29.5-27.5 75.5-40.75T259-757q27 0 53.5 5t52.5 16.5q0-23 16.25-39.25T420.5-791H755q31 0 53 22t22 53v432q0 47.5-33.25 80.75T716-170H323Zm117-189h199.5q15.5 0 26.5 11t11 26.5v37.5q0 17 11 28t28 11q17 0 28-11t11-28v-432H440v27l224.5 224.5q8.5 8.5 10.25 19.25T672-424.5q-4.5 10-13.25 16.25T637-402q-7.5 0-14.25-3T611-413L509-514l-9 9q-13 13-28.5 23.5T440-465v106ZM227-625h51.5q15.5 0 26.5 11t11 26.5v46.5q13 8 26 11.5t27 3.5q23 0 42-7.75t36-23.75l10-9.5-57-57q-29-29-64.5-43.5T259-682q-20.5 0-39.25 3.5T183-668l44 43Z"/></svg>
  );
}

export default HistoryEduIcon;