import {
    Button,
    FormControlLabel,
    Switch,
    Dialog,
    DialogTitle,
    Divider,
    WithStyles,
    withStyles,
    createStyles,
    Theme,
    Typography,
    List,
    ListItemText,
    ListItem,
    ListItemIcon,
    Avatar,
    MobileStepper,
} from "@material-ui/core";
import {
    Info as InfoIcon,
    ChevronLeft as LeftIcon,
    ChevronRight as RightIcon,
    Remove as RemoveIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    Visibility as VisibilityIcon,
    BorderAll as BorderIcon,
    EuroSymbol as EuroIcon,
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    GridOn as GridIcon,
    Timer as TimeIcon,
    Timeline as TimeLineIcon,
} from "@material-ui/icons";
// import InfoIcon from "@material-ui/icons/info";

import "../styling/grid.css";
import React from "react";
import CellComponent from "./cell";
import Cell from "../model/cell";
import Grid from "../model/grid";

const styles = (theme: Theme) =>
    createStyles({
        info: {
            paddingBottom: theme.spacing.unit,
        },
        infoSection: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        },
        dialogPaper: {
            minHeight: "610px",
        },
    });

interface Props extends WithStyles<typeof styles> {
    grid: Grid;
}

export default withStyles(styles)(
    class GridComponent extends React.Component<
        Props,
        {showSearchData: boolean; showInfo: boolean; showInfoPage: number}
    > {
        constructor(props) {
            super(props);
            this.state = {showSearchData: true, showInfo: true, showInfoPage: 0};
        }
        protected resetCosts(): void {
            this.props.grid.forEach(cell => cell.setPathCost(1));
        }
        protected resetWalls(): void {
            this.props.grid.forEach(cell => {
                if (cell.isWall()) cell.setNormal();
            });
        }
        protected changeShowSearchData(showSearchData: boolean): void {
            this.setState({showSearchData: showSearchData});
        }

        protected renderCell(cell: Cell) {
            return (
                <CellComponent
                    key={cell.getID()}
                    searchRender={this.state.showSearchData}
                    cell={cell}
                />
            );
        }
        protected renderRow(row: Cell[], index: number) {
            return <div key={index}>{row.map(cell => this.renderCell(cell))}</div>;
        }
        render() {
            const grid = this.props.grid;
            const cells = grid.getCells();

            return (
                <div className="gridContainer">
                    {this.renderInfo()}
                    <div className="gridControls">
                        <Button
                            onClick={this.resetCosts.bind(this)}
                            variant="contained"
                            color="primary">
                            Reset costs
                        </Button>
                        <Button
                            onClick={this.resetWalls.bind(this)}
                            variant="contained"
                            color="primary">
                            Reset walls
                        </Button>
                        <Button
                            onClick={() => this.setState({showInfo: true})}
                            variant="contained"
                            color="primary"
                            className="info">
                            Info
                            <InfoIcon />
                        </Button>
                        <FormControlLabel
                            className="searchData"
                            control={
                                <Switch
                                    checked={this.state.showSearchData}
                                    onChange={(event, checked) =>
                                        this.changeShowSearchData(checked)
                                    }
                                    color="primary"
                                />
                            }
                            label="Show search data"
                        />
                    </div>
                    <div className="grid">{cells.map((row, i) => this.renderRow(row, i))}</div>
                </div>
            );
        }

        renderQuote(props) {
            return (
                <span
                    style={{
                        backgroundColor: "rgba(0,0,0,0.05)",
                        borderRadius: props.radius || 3,
                        paddingLeft: 2,
                        paddingRight: 2,
                    }}>
                    {props.children}
                </span>
            );
        }
        renderListItem(props) {
            return (
                <ListItem>
                    <Avatar>{props.icon}</Avatar>
                    <ListItemText primary={props.name} secondary={props.text} />
                </ListItem>
            );
        }
        renderInfo() {
            const props = this.props;
            const classes = props.classes;
            const state = this.state;
            const pages = [
                <div className={classes.infoSection}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Search algorithm
                    </Typography>
                    <Typography component="p">
                        This application uses the{" "}
                        <a href="https://en.wikipedia.org/wiki/A*_search_algorithm">
                            A* search algorithm
                        </a>{" "}
                        to find a path between a source and target. <br />
                        A* repeatedly opens the unexplored cell with the lowest predicted cost
                        function:{" "}
                    </Typography>
                    <br />
                    <Divider variant="middle" />
                    <br />
                    <Typography component="h2" variant="h3" align="center" gutterBottom>
                        <this.renderQuote radius={10}>f(n) = c(n) + a &#183; h(n)</this.renderQuote>
                    </Typography>
                    <List>
                        <this.renderListItem
                            icon={"c(n)"}
                            name="Cost function"
                            text={
                                <span>
                                    The cost required to reach a given cell{" "}
                                    <this.renderQuote>n</this.renderQuote> <br />
                                    Usually equivalent to the distance to reach the cell from the
                                    source
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={"h(n)"}
                            name="Heuristic function"
                            text={
                                <span>
                                    Predicts the required cost to get from a given cell{" "}
                                    <this.renderQuote>n</this.renderQuote> to a target cell
                                    <br /> Ignores any possible obstacles along the path.
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={"a"}
                            name="Heuristic weight"
                            text={
                                <span>
                                    A weighting for the heuristic function
                                    <br /> Increasing this weight above it's defualt value of 1, can
                                    make the search faster, but the resulting path might not be
                                    optimal
                                </span>
                            }
                        />
                    </List>
                    <Divider variant="middle" />
                    <br />
                    <Typography component="p">
                        The predicted costs are rounded and shown in each of the cells while the
                        algorithm is running. The frontier will also be highlighted in blue during
                        execution.
                    </Typography>
                </div>,
                <div className={classes.infoSection}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Grid interaction
                    </Typography>
                    <Typography component="p">
                        The grid allows for alteration of cells by using different mouse
                        interactions
                    </Typography>
                    <List>
                        <this.renderListItem
                            icon={<LeftIcon />}
                            name="Left click"
                            text={
                                <span>
                                    Right clicking can be used to toggle between empty cells and the
                                    source
                                    <br /> or between the empty cells and targets if the source is
                                    already present
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<RemoveIcon className="rotate-90" />}
                            name="Scroll"
                            text={
                                <span>
                                    Scrolling can be used to increase and decrease the weights of
                                    empty cells
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<RightIcon />}
                            name="Right click"
                            text={
                                <span>
                                    Left clicking can be used to toggle between empty cells and
                                    walls
                                    <br /> One can also drag a cell, in order to copy it's data to
                                    neighbours
                                </span>
                            }
                        />
                    </List>
                </div>,
                <div className={classes.infoSection}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Grid controls
                    </Typography>
                    <Typography component="p">
                        The grid provides several buttons to alter its contents
                    </Typography>
                    <List>
                        <this.renderListItem
                            icon={<EuroIcon />}
                            name="Reset costs"
                            text={
                                <span>
                                    This button can be used to reset the travel costs for all cells
                                    to 1
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<BorderIcon />}
                            name="Reset walls"
                            text={
                                <span>
                                    This button can be used to remove all walls from the grid
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<VisibilityIcon />}
                            name="Show search data"
                            text={
                                <span>
                                    This toggle can be used to either show or hide the cost
                                    estimates in the grid
                                </span>
                            }
                        />
                    </List>
                </div>,
                <div className={classes.infoSection}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Search controls
                    </Typography>
                    <Typography component="p">
                        The search provides several controls to play with
                    </Typography>
                    <List>
                        <this.renderListItem
                            icon={<PlayIcon />}
                            name="Start"
                            text={<span>This button simply starts the search</span>}
                        />
                        <this.renderListItem
                            icon={<StopIcon />}
                            name="Stop"
                            text={<span>This resets the path found in a previous search</span>}
                        />
                        <this.renderListItem
                            icon={<GridIcon />}
                            name="Use grid distance"
                            text={
                                <span>
                                    This toggle determines whether to use{" "}
                                    <a href="https://en.wiktionary.org/wiki/Manhattan_distance">
                                        manhattan
                                    </a>{" "}
                                    (grid) distance, or{" "}
                                    <a href="https://en.wikipedia.org/wiki/Euclidean_distance">
                                        euclidian
                                    </a>{" "}
                                    distance for the heuristic function
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<RemoveIcon className="rotate-45" />}
                            name="Allow diagonals"
                            text={
                                <span>
                                    This toggle determines whether diagonal paths are allowed
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<TimeIcon />}
                            name="Speed"
                            text={
                                <span>
                                    This slider determines the speed at which to execute the
                                    algorithm
                                </span>
                            }
                        />
                        <this.renderListItem
                            icon={<TimeLineIcon />}
                            name="Heuristic weight"
                            text={
                                <span>
                                    This slider changes the weighting of the heuristic function
                                </span>
                            }
                        />
                    </List>
                </div>,
            ];

            return (
                <Dialog
                    classes={{paper: classes.dialogPaper}}
                    className={classes.info}
                    open={state.showInfo}
                    onClose={() => this.setState({showInfo: false})}
                    fullWidth={true}
                    aria-labelledby="simple-dialog-title">
                    <MobileStepper
                        steps={pages.length}
                        position="static"
                        activeStep={state.showInfoPage}
                        nextButton={
                            <Button
                                size="small"
                                onClick={() =>
                                    this.setState(state => ({
                                        showInfoPage: Math.min(
                                            pages.length - 1,
                                            state.showInfoPage + 1
                                        ),
                                    }))
                                }
                                disabled={state.showInfoPage == pages.length - 1}>
                                Next
                                {<KeyboardArrowRightIcon />}
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={() =>
                                    this.setState(state => ({
                                        showInfoPage: Math.max(0, state.showInfoPage - 1),
                                    }))
                                }
                                disabled={state.showInfoPage == 0}>
                                <KeyboardArrowLeftIcon />
                                Back
                            </Button>
                        }
                    />
                    {pages[this.state.showInfoPage]}
                </Dialog>
            );
        }
    }
);
