import {default as React, FunctionComponent, useContext} from "react";
import {Box, Button, IconButton, Slide, Tooltip, useTheme, FormGroup, FormControlLabel, Switch} from "@material-ui/core";
import {useConfirmation} from "../../hooks/useConfirmation";
import DeleteIcon from "@material-ui/icons/Delete";
import {LanguagesMenu} from "../common/form/LanguagesMenu";
import {SearchField} from "./SearchField";
import {Link} from "react-router-dom";
import {LINKS, PARAMS} from "../../constants/links";
import AddIcon from "@material-ui/icons/Add";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {useRepository} from "../../hooks/useRepository";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {T, useTranslate} from "@polygloat/react";

export const MenuBar: FunctionComponent = () => {
    let repositoryDTO = useRepository();
    const actions = container.resolve(TranslationActions);
    const listContext = useContext(TranslationListContext);

    const t = useTranslate();

    return (
        <Box mb={2}>
            <Box display="flex">
                <Box flexGrow={1} display="flex">
                    <Slide in={listContext.isSomeChecked()} direction="right" mountOnEnter unmountOnExit>
                        <Box pr={2} ml={-2}>
                            <Tooltip title={<T>translations_delete_selected</T>}>
                                <IconButton color="secondary"
                                            onClick={() =>
                                                useConfirmation()({
                                                    onConfirm: () => actions.loadableActions.delete
                                                        .dispatch(repositoryDTO.id, Array.from(listContext.checkedSources)),
                                                    confirmButtonText: "Delete",
                                                    confirmButtonColor: "secondary",
                                                    message: `Are you sure you want to delete all checked ` +
                                                        `(${listContext.checkedSources.size}) translation sources?`,
                                                    title: "Delete confirmation"
                                                })
                                            }>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Slide>
                    <Box flexGrow={1} display="flex" alignItems="flex-end">
                        <Box pr={2}>
                            <LanguagesMenu/>
                        </Box>
                        <Box pr={2}>
                            <SearchField/>
                        </Box>
                        <FormGroup>
                            <FormControlLabel labelPlacement="start"
                                              control={<Switch color={"primary"}
                                                               size="small"
                                                               checked={listContext.showKeys}
                                                               onChange={e => listContext.setShowKeys(!!e.target.checked)}
                                              />}
                                              label={t("show_keys")}
                            />
                        </FormGroup>
                    </Box>
                </Box>
                <Box display="flex" alignItems="flex-end">
                    <Button component={Link} variant="outlined" color="primary" size={"small"}
                            to={LINKS.REPOSITORY_TRANSLATIONS_ADD.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id})}
                            startIcon={<AddIcon/>}
                    >
                        <T>translation_add</T>
                    </Button>
                </Box>
            </Box>
        </Box>
    )
};