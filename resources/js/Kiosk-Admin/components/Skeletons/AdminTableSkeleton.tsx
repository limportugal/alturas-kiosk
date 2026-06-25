import { Box, Paper, Skeleton } from '@mui/material';

interface AdminTableSkeletonProps {
    rows?: number;
    showSearch?: boolean;
    showActionButton?: boolean;
}

export default function AdminTableSkeleton({
    rows = 10,
    showSearch = true,
    showActionButton = true,
}: AdminTableSkeletonProps) {
    return (
        <Paper
            sx={{
                width: '100%',
                height: 'calc(100vh - 180px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Skeleton variant="text" width={160} height={34} />

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {showSearch && <Skeleton variant="rounded" width={220} height={40} />}
                    {showActionButton && <Skeleton variant="rounded" width={140} height={40} />}
                </Box>
            </Box>

            <Box sx={{ px: 3, py: 2, flex: 1 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={`header-${index}`} variant="text" height={28} />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <Box
                            key={`row-${rowIndex}`}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            {Array.from({ length: 5 }).map((__, columnIndex) => (
                                <Skeleton
                                    key={`cell-${rowIndex}-${columnIndex}`}
                                    variant="rounded"
                                    height={72}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                sx={{
                    px: 3,
                    py: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Skeleton variant="text" width={140} height={26} />
                <Skeleton variant="rounded" width={220} height={32} />
            </Box>
        </Paper>
    );
}
