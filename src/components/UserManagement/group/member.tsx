import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import DialogTemplate from '@/Global/Dialog';
import { useTranslations } from 'next-intl';
import { listGroupMember, listMemberNotInGroup, listUser } from '@/service/user.service';
import { useAppSelector } from '@/lib/hooks';
import { Autocomplete, Box, TextField } from '@mui/material';
import DataTable from '@/Global/data-table';

interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
    groupUUID: string;
}
export default function GroupMember(props: IProps) {
    const t = useTranslations('userlist')

    const [page, setPage] = useState<number>(1);
    const [userPage, setUserPage] = useState<number>(1);
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [rowCount, setRowCount] = useState<number>(1);
    const [rowUserCount, setRowUserCount] = useState<number>(1);
    const [userDataOriginal, setUserDataOriginal] = useState<any>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const results = await listMemberNotInGroup(inputValue, props.groupUUID, userPage, 10);
                setUserData(results.data)
                setRowUserCount(results.rowCount)
            } catch (error) {

            }
        }

        fetchUsers();
    }, [userPage]);

    useEffect(() => {

        const fetchMember = async () => {
            try {
                const results = await listGroupMember(props.groupUUID, page, 10);
                setRowCount(results.data.rowCount);
                setData(results.data.data)
            } catch (error) {
                console.log(error);

            }
        }
        fetchMember();
    }, [page])


    const searchTimeout = useRef<number | undefined>(undefined);
    useEffect(() => {
        window.clearTimeout(searchTimeout.current);
        searchTimeout.current = window.setTimeout(() => {
            console.log({ inputValue });


        }, 300);
        return () => window.clearTimeout(searchTimeout.current);
    }, [inputValue, userDataOriginal]);

    return (
        <DialogTemplate
            open={props.open}
            setOpen={props.setOpen}
            title={t('groupMember')}
            content={<>

                <Box mt={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Autocomplete
                            options={userData}
                            getOptionLabel={(value: any) => value.displayName}
                            multiple
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                            sx={{ width: 320 }}
                            value={selectedUsers}
                            onChange={(event, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => <TextField {...params} label="Users" size="small" />}
                        />
                    </Box>
                    <Box mt={2}>
                        <DataTable
                            columns={[
                            ]}
                            data={[]}
                            pageCount={10}
                            currentPage={1}
                            loading={false}
                            onPageChange={setPage}
                        />
                    </Box>
                </Box>
            </>}
        />
    )
}