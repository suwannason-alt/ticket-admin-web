import { Group } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import Permission from './permissionEdit';

interface IProps {
    roles: any[]
    count: number;
    setSelectedRole: Dispatch<SetStateAction<any>>,
    selectedRole: any;
}

export default function RoleLayout(props: IProps) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 1 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group />
                  Roles ({props.count})
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {props.roles.map((role) => {
                    const isSelected = props.selectedRole?.id === role.id;

                    return (
                      <Card
                        key={role.id}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          border: isSelected ? 2 : 1,
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => props.setSelectedRole(role)}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {role.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {role.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Permissions Editor */}
          <Permission selectedRole={props.selectedRole} />
        </Box>
    )
}