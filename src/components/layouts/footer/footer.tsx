
import { Box, Typography, Link, IconButton, Divider } from '@mui/material';
import { GitHub, LinkedIn, Instagram } from '@mui/icons-material';
import Grid from '@mui/material/Grid';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primart.default',
                color: 'text.primary',
            }}
        >
            <Divider />
            <Box
                sx={{
                    py: 4,
                    px: { xs: 2, sm: 6 },
                    mt: 'auto',
                }}
            >


                <Grid container spacing={4}>
                    {/* درباره ما */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom>درباره ما</Typography>
                        <Typography variant="body2">
                            ما یک تیم خلاق در زمینه طراحی و توسعه وب هستیم. هدف ما ایجاد تجربه کاربری جذاب با طراحی‌های مدرن است.
                        </Typography>
                    </Grid>

                    {/* لینک‌ها */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom>لینک‌های مفید</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" underline="hover" color="inherit">خانه</Link>
                            <Link href="#" underline="hover" color="inherit">محصولات</Link>
                            <Link href="#" underline="hover" color="inherit">تماس با ما</Link>
                        </Box>
                    </Grid>

                    {/* شبکه‌های اجتماعی */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom>ما را دنبال کنید</Typography>
                        <Box>
                            <IconButton
                                component="a"
                                href="https://github.com"
                                target="_blank"
                                rel="noopener"
                                sx={{ color: 'text.primary', }}
                            >
                                <GitHub />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener"
                                sx={{ color: 'text.primary', }}
                            >
                                <LinkedIn />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener"
                                sx={{ color: 'text.primary', }}
                            >
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                {/* خط زیرین */}
                <Box textAlign="center" pt={4} fontSize="14px" color="gray">
                    © {new Date().getFullYear()} تمام حقوق محفوظ است.
                </Box>
            </Box>

        </Box>
    );
}