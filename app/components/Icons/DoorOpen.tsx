import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function DoorOpenIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M160-122.5q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11h42.5v-565q0-30.94 22.03-52.97 22.03-22.03 52.97-22.03h405q30.94 0 52.97 22.03 22.03 22.03 22.03 52.97v565H800q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11H160Zm522.5-75v-565H501V-802q43.5 7.5 71.25 40.2T600-685.5V-239q0 27.5-17.75 48.5T537-165v-32.5h145.5Zm-242.25-245q15.75 0 26.5-11t10.75-26.75q0-15.75-10.78-26.5T440-517.5q-15.5 0-26.5 10.78t-11 26.72q0 15.5 11 26.5t26.75 11Z"/></svg>
  );
}

export default DoorOpenIcon;