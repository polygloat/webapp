import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {useRepository} from "../../hooks/useRepository";
import {Box} from "@material-ui/core";
import {TranslationsRow} from "./TranslationsRow";
import {Header} from "./Header";
import {BoxLoading} from "../common/BoxLoading";
import {Pagination} from "./Pagination";
import {LINKS, PARAMS} from "../../constants/links";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {EmptyListMessage} from "../common/EmptyListMessage";
import {FabAddButtonLink} from "../common/buttons/FabAddButtonLink";
import {MenuBar} from "./MenuBar";
import {BaseView} from "../layout/BaseView";

export const TranslationsGrid: FunctionComponent = (props) => {
    let repositoryDTO = useRepository();

    const listContext = useContext(TranslationListContext);
    const isEmpty = listContext.listLoadable.data.paginationMeta.allCount === 0;
    const isSearch = listContext.listLoadable.data.params.search;

    const onEmptyInner = (
        <>
            <EmptyListMessage/>
            {!isSearch &&
            <Box display="flex" justifyContent="center">
                <FabAddButtonLink to={LINKS.REPOSITORY_TRANSLATIONS_ADD.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id})}/>
            </Box>
            }
        </>
    );

    const onNotEmptyInner = (
        <>
            {listContext.listLoadable.data ?
                <Box display="flex" flexDirection="column" flexGrow={1} fontSize={14}>
                    <Header/>
                    {listContext.listLoadable.data.data.map(t => <TranslationsRow key={t.name} data={t}/>)}
                </Box>
                :
                <BoxLoading/>
            }
            <Box>
                <Pagination/>
            </Box>
        </>
    );

    return (
        <BaseView title="Translations" headerChildren={isSearch || !isEmpty ? <MenuBar/> : null} loading={listContext.listLoadable.loading}>
            {isEmpty ? onEmptyInner : onNotEmptyInner}
        </BaseView>
    )
};