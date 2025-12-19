import { ExpandMore, Security } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getPermission } from '@/service/role.service';
import { groupBy } from 'lodash'


interface IProps {
    selectedRole?: any
}
export default function Permission(props: IProps) {
    const [permission, setPermission] = useState([]);
    const [groupedPermission, setGroupedPermission] = useState<any>({});
    const [keyService, setKeyService] = useState<string[]>([]);
    useEffect(() => {
        const readPermission = async (uuid: string) => {
            const results = await getPermission(uuid);
            setPermission(results.data)

        }
        if (props.selectedRole) {
            readPermission(props.selectedRole.uuid)
        }        

    }, [props.selectedRole])

    useEffect(() => {
        if (permission.length > 0) {
            const servicePermission = groupBy(permission, 'service_uuid');
            const keys = Object.keys(servicePermission)
            setKeyService(keys)
            setGroupedPermission(servicePermission)

        }
    }, [permission])
    return (
        <Box>
            <Card>
                <CardContent>
                    {props.selectedRole ? (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Security />
                                {props.selectedRole.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {props.selectedRole.description}
                            </Typography>

                            <Box >
                                {keyService.map((serviceKey) => (
                                    <Accordion key={serviceKey} defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Service: {groupedPermission[serviceKey][0]?.service}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Feature</TableCell>
                                                        <TableCell align="center">View</TableCell>
                                                        <TableCell align="center">Insert</TableCell>
                                                        <TableCell align="center">Update</TableCell>
                                                        <TableCell align="center">Delete</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {groupedPermission[serviceKey].map((p: any) => (
                                                        <TableRow key={p.feature_uuid}>
                                                            <TableCell>{p.feature}</TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    size="small"
                                                                    defaultChecked={p.view === 'true'}
                                                                    disabled={props.selectedRole.company_uuid === null}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    size="small"
                                                                    defaultChecked={p.insert === 'true'}
                                                                    disabled={props.selectedRole.company_uuid === null}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    size="small"
                                                                    defaultChecked={p.update === 'true'}
                                                                    disabled={props.selectedRole.company_uuid === null}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    size="small"
                                                                    defaultChecked={p.delete === 'true'}
                                                                    disabled={props.selectedRole.company_uuid === null}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Security sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Select a role to manage permissions
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}