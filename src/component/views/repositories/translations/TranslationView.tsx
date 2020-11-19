import * as React from 'react';
import {RepositoryLanguageProvider} from "../../../../hooks/RepositoryLanguagesProvider";
import {TranslationsGrid} from "../../../Translations/TranslationsGrid";
import {Container, Box} from "@material-ui/core";
import {TranslationGridContextProvider} from "../../../Translations/TtranslationsGridContextProvider";
import grey from '@material-ui/core/colors/grey';
import {LINKS} from "../../../../constants/links";
import {TranslationCreationDialog} from "../../../Translations/TranslationCreationDialog";
import { Route } from 'react-router-dom';

export default function TranslationView() {
    return (
        <RepositoryLanguageProvider>
            <Container maxWidth={false}
                       style={{
                           backgroundColor: "rgb(253,253,253)",
                           borderBottom: `1px solid ${grey[100]}`,
                           padding: 0,
                           margin: "0 -12px 0 -12px",
                           width: "calc(100% + 24px)"
                       }}>
                <Box minHeight="calc(100vh - 80px)">
                    <TranslationGridContextProvider>
                        <TranslationsGrid/>
                        <Route path={LINKS.REPOSITORY_TRANSLATIONS_ADD.template}>
                            <TranslationCreationDialog/>
                        </Route>
                    </TranslationGridContextProvider>
                </Box>
            </Container>
        </RepositoryLanguageProvider>
    );
}
