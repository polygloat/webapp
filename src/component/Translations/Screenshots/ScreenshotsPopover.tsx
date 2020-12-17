import * as React from 'react';
import {FunctionComponent, useEffect, useState, ReactNode} from 'react';
import {BoxLoading} from "../../common/BoxLoading";
import {Box, createStyles, makeStyles, Popover, Theme, Typography} from '@material-ui/core';
import {KeyTranslationsDTO, ScreenshotDTO} from "../../../service/response.types";
import {ScreenshotActions} from "../../../store/repository/ScreenshotActions";
import {container} from 'tsyringe';
import {useRepository} from "../../../hooks/useRepository";
import {T} from '@polygloat/react';
import AddIcon from '@material-ui/icons/Add';
import {ScreenshotDetail} from "./ScreenshotDetail";
import {ScreenshotThumbnail} from "./ScreenshotThumbnail";
import {Alert} from "../../common/Alert";
import {useConfig} from "../../../hooks/useConfig";
import clsx from 'clsx';
import green from '@material-ui/core/colors/green';
import BackupTwoToneIcon from '@material-ui/icons/BackupTwoTone';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import {red} from '@material-ui/core/colors';
import {MessageActions} from "../../../store/global/messageActions";
import {Message} from "../../../store/global/types";

export interface ScreenshotsPopoverProps {
    data: KeyTranslationsDTO,
    anchorEl: Element,
    onClose: () => void
}

const actions = container.resolve(ScreenshotActions)
const messageActions = container.resolve(MessageActions)

const useStyles = makeStyles((theme: Theme) => createStyles({
    addIcon: {
        fontSize: 50,
    },
    addBox: {
        overflow: "hidden",
        width: "100px",
        height: "100px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        margin: "1px",
        cursor: "pointer",
        borderColor: theme.palette.grey[200],
        color: theme.palette.grey[200],
        border: `1px dashed ${theme.palette.grey[200]}`,
        "&:hover": {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
        },
        flex: "0 0 auto"
    },
    popover: {
        //overflow: "visible"
    },
    dropZoneValidation: {
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.2s"
    },
    valid: {
        backdropFilter: "blur(5px)",
        border: `10px solid ${green[200]}`,
        backgroundColor: theme.palette.grey[200],
        opacity: 0.9
    },
    invalid: {
        border: `10px solid ${red[200]}`,
        opacity: 0.9,
        backgroundColor: theme.palette.grey[200],
        backdropFilter: "blur(5px)",
    }

}));

const MAX_FILE_COUNT = 20;

export const ScreenshotsPopover: FunctionComponent<ScreenshotsPopoverProps> = (props) => {
    const screenshotsLoadable = actions.useSelector(s => s.loadables.getForKey)
    const uploadLoadable = actions.useSelector(s => s.loadables.uploadScreenshot)

    const screenshots = screenshotsLoadable.data as ScreenshotDTO[]
    const repository = useRepository();
    const fileRef = React.createRef<HTMLInputElement>();
    const [detailFileName, setDetailFileName] = React.useState(null);
    const config = useConfig();
    const id = open ? `screenshot-popover-${props.data.id}` : undefined;
    const [dragOver, setDragOver] = useState(null as null | "valid" | "invalid");
    const [dragEnterTarget, setDragEnterTarget] = useState(null)

    useEffect(() => {
        actions.loadableActions.getForKey.dispatch(repository.id, props.data.name)
        return () => {
            actions.loadableReset.uploadScreenshot.dispatch()
        }
    }, [])

    const onDragEnter = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragEnterTarget(e.target);
        if (e.dataTransfer.items) {
            const files = dataTransferItemsToArray(e.dataTransfer.items)
            if (files.length > MAX_FILE_COUNT) {
                setDragOver("invalid");
                return;
            }
            setDragOver("valid");
        }
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.target === dragEnterTarget) {
            setDragOver(null);
        }
    }

    const onDrop = async (e: React.DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (e.dataTransfer.items) {
            const files = dataTransferItemsToArray(e.dataTransfer.items)
            validateAndUpload(files);
        }
        setDragOver(null);
    };

    const validateAndUpload = (files: File[]) => {
        const validation = validate(files);
        if (validation.valid) {
            actions.loadableActions.uploadScreenshot.dispatch(files, repository.id, props.data.name)
            return;
        }
        validation.errors.forEach(e => messageActions.showMessage.dispatch(new Message(e, "error")));
    }

    const dataTransferItemsToArray = (items: DataTransferItemList): File[] => {
        const result = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                result.push(items[i].getAsFile());
            }
        }
        return result;
    }

    React.useEffect(() => {
        const listener = (e) => {
            e.preventDefault();
        }

        const pasteListener = (e: ClipboardEvent) => {
            const files: File[] = [];
            for (let i = 0; i < e.clipboardData.files.length; i++) {
                files.push(e.clipboardData.files.item(i));
            }
            validateAndUpload(files);
        }

        window.addEventListener("dragover", listener, false);
        window.addEventListener("drop", listener, false);
        document.addEventListener("paste", pasteListener)

        return () => {
            window.removeEventListener("dragover", listener, false);
            window.removeEventListener("drop", listener, false);
            document.removeEventListener("paste", pasteListener)
        }
    }, [])

    const classes = useStyles({});


    function onFileSelected(e: React.SyntheticEvent) {
        const files = (e.target as HTMLInputElement).files
        const toUpload: File[] = []
        for (let i = 0; i < files.length; i++) {
            toUpload.push(files.item(i))
        }
        validateAndUpload(toUpload);
    }

    const validate = (files: File[]) => {
        const types = ["image/png", "image/jpeg", "image/gif"];

        const result = {
            valid: false,
            errors: [] as ReactNode[],
        }

        if (files.length > 20) {
            result.errors.push(<T>translations.screenshots.validation.too_many_files</T>)
        }

        files.forEach(file => {
            if (file.size > config.maxUploadFileSize * 1024) {
                result.errors.push(<T parameters={{filename: file.name}}>translations.screenshots.validation.file_too_big</T>)
            }
            if (types.indexOf(file.type) < 0) {
                result.errors.push(<T parameters={{filename: file.name}}>translations.screenshots.validation.unsupported_format</T>)
            }
        })

        const valid = result.errors.length === 0;
        return {...result, valid};
    }

    const addBox = (
        <Box key="add" className={`${classes.addBox}`}
             onClick={() => fileRef.current.dispatchEvent(new MouseEvent("click"))}>
            <AddIcon className={classes.addIcon}/>
        </Box>);

    return (
        <>
            <Popover
                id={id}
                open={true}
                anchorEl={props.anchorEl}
                onClose={props.onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{paper: classes.popover}}
            >
                <Box width="408px">
                    <input type="file" style={{display: "none"}} ref={fileRef} onChange={e => onFileSelected(e)} multiple/>
                    <Box p={2}>
                        <Typography><T>translations_screenshots_popover_title</T></Typography>
                    </Box>

                    {!!uploadLoadable?.data?.errors?.length &&
                    <Box>
                        <Alert severity="error" style={{marginTop: 0, width: "100%"}}><T>translations.screenshots.some_screenshots_not_uploaded</T></Alert>
                    </Box>
                    }
                    <Box position="relative" display="flex" onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave} overflow="visible">
                        <Box zIndex={2} position="absolute" width="100%" height="100%"
                             className={clsx({
                                 [classes.dropZoneValidation]: true,
                                 [classes.valid]: dragOver === "valid",
                                 [classes.invalid]: dragOver === "invalid"
                             })} display="flex" alignItems="center" justifyContent="center">
                            {dragOver === "valid" &&
                            <BackupTwoToneIcon style={{fontSize: 150}}/>
                            }
                            {dragOver === "invalid" &&
                            <HighlightOffTwoToneIcon style={{fontSize: 150}}/>
                            }
                        </Box>
                        {screenshotsLoadable.loading || !screenshotsLoadable.touched ? <BoxLoading/>
                            :
                            screenshots.length > 0 ?
                                <Box display="flex" flexWrap="wrap" overflow="visible"> {
                                    screenshots.map(s =>
                                        <ScreenshotThumbnail key={s.id} onClick={() => setDetailFileName(s.filename)} screenshotData={s}/>
                                    )}
                                    {addBox}
                                </Box>
                                :
                                <>
                                    <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1} p={2}>
                                        <Box><T>no_screenshots_yet</T></Box>
                                    </Box>
                                    {addBox}
                                </>}
                    </Box>
                </Box>
            </Popover>
            <ScreenshotDetail fileName={detailFileName} onClose={() => setDetailFileName(null)}/>
        </>
    )
};