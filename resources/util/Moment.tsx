import React from "react";
import moment, { Moment } from "moment";
import { Tooltip, makeStyles, Typography } from "@material-ui/core";

interface StyleProps {
  darkMode: boolean;
}
const useStyles = makeStyles(() => ({
  moment: {
    color: "#b8c5d9bd",
  },
}));
interface MomentProps {
  time: string;
  relative?: boolean;
}
const Moment = ({ time, relative }: MomentProps): JSX.Element => {
  const classes = useStyles();
  const timeFormatted = moment(time).format("hh - MMMM DD YYYY");
  const date: string = !relative
    ? moment(time).local().format("MMMM YYYY")
    : moment(time).local().fromNow();

  return (
    <Tooltip className={classes.moment} title={timeFormatted} arrow interactive>
      <Typography>{date}</Typography>
    </Tooltip>
  );
};

//Moment.propTypes = {
// time: PropTypes.string,
// profile: PropTypes.bool,
//};

export default Moment;
