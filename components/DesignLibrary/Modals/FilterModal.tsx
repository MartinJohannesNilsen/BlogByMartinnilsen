"use client";
import { useTheme } from "@/styles/themes/ThemeProvider";
import { Close } from "@mui/icons-material";
import {
  Box,
  Typography,
  useMediaQuery,
  Modal,
  styled,
  IconButton,
  Alert,
} from "@mui/material";
import Select from "react-select";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { useState, useRef } from "react";
import { NavbarButton } from "../Buttons/NavbarButton";
import { FilterModalProps } from "@/types";

const StyledInput = styled("input")(({ theme }) => ({
  border:
    "1px solid " +
    (theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[400]),
  borderRadius: 5,
  padding: "5px 5px",
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: "1rem",
  color: theme.palette.text.primary,
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: theme.palette.primary.main,
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
  },
}));

export const FilterModal = (props: FilterModalProps) => {
  const { theme } = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const [startDate, setStartDate] = useState<string>(
    props.initialFilters.startDate || ""
  );
  const [endDate, setEndDate] = useState<string>(
    props.initialFilters.endDate || ""
  );
  const [minReadTime, setMinReadTime] = useState<number | null>(
    props.initialFilters.minReadTime || null
  );
  const [maxReadTime, setMaxReadTime] = useState<number | null>(
    props.initialFilters.maxReadTime || null
  );
  const [tags, setTags] = useState<string[]>(props.initialFilters.tags || []);
  const [sortOrder, setSortOrder] = useState<string>(
    props.initialFilters.sortOrder || "desc"
  );
  const [warning, setWarning] = useState<string | null>(null);

  // useRef to store the previous valid filter state
  const previousFilters = useRef({
    startDate: props.initialFilters.startDate || "",
    endDate: props.initialFilters.endDate || "",
    minReadTime: props.initialFilters.minReadTime || null,
    maxReadTime: props.initialFilters.maxReadTime || null,
    tags: props.initialFilters.tags || [],
    sortOrder: props.initialFilters.sortOrder || "desc",
  });

  const handleApplyFilters = (e: any) => {
    e.preventDefault();
    setWarning(null); // Reset warning on each attempt

    let adjustedStartDate = startDate;
    let adjustedEndDate = endDate;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setWarning("Start Date cannot be after End Date.");
      return;
    }

    if (
      minReadTime !== null &&
      maxReadTime !== null &&
      minReadTime > maxReadTime
    ) {
      setWarning("Min Read cannot be greater than Max Read.");
      return;
    }

    const filters = {
      startDate: adjustedStartDate,
      endDate: adjustedEndDate,
      minReadTime: minReadTime,
      maxReadTime: maxReadTime,
      tags: tags,
      sortOrder: sortOrder,
    };

    // Update the ref with the current valid filters
    previousFilters.current = filters;

    // Count the number of filters applied
    var filterCount = 0;
    if (adjustedStartDate) filterCount++;
    if (adjustedEndDate) filterCount++;
    if (minReadTime !== null) filterCount++;
    if (maxReadTime !== null) filterCount++;
    if (tags.length > 0) filterCount++;
    if (sortOrder !== "desc") filterCount++;
    props.setFilterCount(filterCount);

    // Apply the filters
    props.onApplyFilters(filters);
    props.handleModalClose();
  };

  const handleClearFilters = () => {
    setWarning(null);
    setStartDate("");
    setEndDate("");
    setMinReadTime(null);
    setMaxReadTime(null);
    setTags([]);
    setSortOrder("desc");
  };

  const handleResetFilters = () => {
    if (warning) {
      // If there's a warning, revert to the previous valid state
      setWarning(null);
      setStartDate(previousFilters.current.startDate);
      setEndDate(previousFilters.current.endDate);
      setMinReadTime(previousFilters.current.minReadTime);
      setMaxReadTime(previousFilters.current.maxReadTime);
      setTags(previousFilters.current.tags);
      setSortOrder(previousFilters.current.sortOrder);
    } else {
      // If no warning, clear all filters and close modal
      handleClearFilters();
      props.setFilterCount(0);
      props.onApplyFilters({});
      props.handleModalClose();
    }
  };

  const handleSortOrderChange = (event: any, newSortOrder: string | null) => {
    setWarning(null);
    if (newSortOrder !== null) {
      setSortOrder(newSortOrder);
    }
  };

  const handleMinReadTimeChange = (e: any) => {
    setWarning(null);
    let value =
      e.target.value === "" ? null : Math.max(1, parseInt(e.target.value));
    if (isNaN(value!)) {
      value = null;
    }
    setMinReadTime(value);
  };

  const handleMaxReadTimeChange = (e: any) => {
    setWarning(null);
    let value =
      e.target.value === "" ? null : Math.max(1, parseInt(e.target.value));
    if (isNaN(value!)) {
      value = null;
    }
    setMaxReadTime(value);
  };

  const handleClearStartDate = () => {
    setWarning(null);
    setStartDate("");
  };

  const handleClearEndDate = () => {
    setWarning(null);
    setEndDate("");
  };

  const handleClearMinReadTime = () => {
    setWarning(null);
    setMinReadTime(null);
  };

  const handleClearMaxReadTime = () => {
    setWarning(null);
    setMaxReadTime(null);
  };

  const handleClearTags = () => {
    setWarning(null);
    setTags([]);
  };

  const handleClearSortOrder = () => {
    setWarning(null);
    setSortOrder("desc");
  };

  const handleStartDateChange = (e: any) => {
    setWarning(null);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: any) => {
    setWarning(null);
    setEndDate(e.target.value);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 370,
    bgcolor: "background.paper",
    borderRadius: 2,
    outline: 0,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    rowGap: "10px",
    justifyContent: "flex-start",
    boxShadow: 24,
    p: xs ? "20px 15px 20px 20px" : "20px 15px 20px 20px",
  };

  // Styles for react-select (tags input)
  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme.palette.primary.main,
      borderColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[700]
          : theme.palette.grey[400],
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      boxShadow: state.isFocused
        ? "0 0 0 1px " + theme.palette.primary.main
        : null,
      color: theme.palette.text.primary,
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: theme.palette.primary.main,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused
        ? theme.palette.action.hover
        : theme.palette.primary.main,
      color: theme.palette.text.primary,
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: theme.palette.text.primary,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: theme.palette.text.secondary,
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: theme.palette.text.primary,
    }),
    multiValue: (baseStyles) => ({
      ...baseStyles,
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[700]
          : theme.palette.grey[400],
      color: theme.palette.text.primary,
    }),
    multiValueLabel: (baseStyles) => ({
      ...baseStyles,
      color: theme.palette.text.primary,
    }),
    multiValueRemove: (baseStyles) => ({
      ...baseStyles,
      color: theme.palette.text.primary,
      ":hover": {
        backgroundColor: theme.palette.action.hover,
      },
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.grey[50],
    }),
  };

  return (
    <Modal open={props.open} onClose={props.handleModalClose}>
      <Box component="form" onSubmit={handleApplyFilters} sx={style}>
        {/* Close button */}
        <IconButton
          style={{ position: "absolute", top: "5px", right: "5px" }}
          onClick={() => {
            props.handleModalClose();
          }}
        >
          <Close sx={{ color: theme.palette.text.primary }} />
        </IconButton>
        {/* Title */}
        <Typography
          fontFamily={theme.typography.fontFamily}
          variant="h5"
          fontWeight="800"
          color={theme.palette.text.primary}
          mb={1}
          fontSize={"1.5rem"}
          sx={{ userSelect: "none" }}
        >
          Filtering
        </Typography>

        {/* Start Date */}
        <Box display="flex" gap="5px" alignItems="center" mt={1}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            After:
          </Typography>
          <Box flexGrow="1" />
          <StyledInput
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
            sx={{ width: "200px" }}
          />
          <IconButton
            aria-label="clear min read time"
            size="small"
            onClick={handleClearStartDate}
          >
            <Close
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>

        {/* End Date */}
        <Box display="flex" gap="5px" alignItems="center" mt={1}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            Before:
          </Typography>
          <Box flexGrow="1" />
          <StyledInput
            type="datetime-local"
            value={endDate}
            onChange={handleEndDateChange}
            sx={{ width: "200px" }}
          />
          <IconButton
            aria-label="clear min read time"
            size="small"
            onClick={handleClearEndDate}
          >
            <Close
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>

        {/* Min Read Time */}
        <Box display="flex" gap="5px" alignItems="center" mt={1}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            Min Read:
          </Typography>
          <Box flexGrow="1" />
          <StyledInput
            type="number"
            min={1}
            value={minReadTime === null ? "" : minReadTime}
            onChange={handleMinReadTimeChange}
            sx={{ width: "60px" }}
          />
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="400"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            minute(s)
          </Typography>
          <IconButton
            aria-label="clear min read time"
            size="small"
            onClick={handleClearMinReadTime}
          >
            <Close
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>

        {/* Max Read Time */}
        <Box display="flex" gap="5px" alignItems="center" mt={1}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            Max Read:
          </Typography>
          <Box flexGrow="1" />
          <StyledInput
            type="number"
            min={1}
            value={maxReadTime === null ? "" : maxReadTime}
            onChange={handleMaxReadTimeChange}
            sx={{ width: "60px" }}
          />
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="400"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            minute(s)
          </Typography>
          <IconButton
            aria-label="clear max read time"
            size="small"
            onClick={handleClearMaxReadTime}
          >
            <Close
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>

        {/* Sort Order */}
        <Box display="flex" gap="10px" alignItems="center" mt={1}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            Sort Order:
          </Typography>
          <Box flexGrow="1" />
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={handleSortOrderChange}
            sx={{ height: "30px" }} // Adjust to match input height
          >
            <ToggleButton
              value="desc"
              sx={{
                textTransform: "none",
                color: theme.palette.text.primary,
                opacity: sortOrder === "desc" ? 1 : 0.7, // Reduce opacity when not selected
                "&:focus": {
                  backgroundColor: theme.palette.text.primary + "10",
                },
              }}
              disableRipple
            >
              Newest
            </ToggleButton>
            <ToggleButton
              value="asc"
              sx={{
                textTransform: "none",
                color: theme.palette.text.primary,
                opacity: sortOrder === "asc" ? 1 : 0.7, // Reduce opacity when not selected
                "&:focus": {
                  backgroundColor: theme.palette.text.primary + "10",
                },
              }}
              disableRipple
            >
              Oldest
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton
            aria-label="clear sort order"
            size="small"
            onClick={handleClearSortOrder}
            sx={{ ml: -0.75 }}
          >
            <Close
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            />
          </IconButton>
        </Box>

        {/* Tags */}
        <Box display="flex" mt={1} mb={1.5}>
          <Typography
            fontFamily={theme.typography.fontFamily}
            variant="body1"
            fontWeight="600"
            color={theme.palette.text.primary}
            fontSize={"1rem"}
            sx={{ userSelect: "none" }}
          >
            Tags:
          </Typography>
          <Box flexGrow="1" />
          <Box width="230px">
            <Select
              isMulti
              isSearchable
              isClearable
              placeholder=""
              value={tags.map((tag) => ({ value: tag, label: tag }))}
              onChange={(array) => {
                setTags(array.map((item) => item.value));
              }}
              options={
                props.tags
                  ? props.tags.map((tag) => ({ value: tag, label: tag }))
                  : []
              }
              maxMenuHeight={204}
              styles={selectStyles}
            />
          </Box>
        </Box>

        {warning && <Alert severity="warning">{warning}</Alert>}
        <Box display="flex" justifyContent="flex-end" mb={-1} gap={1}>
          <NavbarButton
            onClick={handleResetFilters}
            text={warning ? "Reset" : "Clear"}
            variant="outline"
            sxButton={{ width: "80px" }}
            sxText={{ fontWeight: 800 }}
          />
          <NavbarButton
            type="submit"
            text="Apply"
            variant="outline"
            sxButton={{ width: "80px" }}
            sxText={{ fontWeight: 800 }}
          />
        </Box>
      </Box>
    </Modal>
  );
};
