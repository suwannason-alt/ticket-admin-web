import { Security } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';


interface IProps {
    selectedRole?: any
}
export default function Permission(props: IProps) {
    return (
        <Box>
            <Card>
                <CardContent>
                    {props.selectedRole ? (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Security />
                                Permissions for {props.selectedRole.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Configure access permissions for each service and feature
                            </Typography>
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